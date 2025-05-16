import { z } from 'zod'
import { DbErr } from '~/@/db/interface/error'
import { OrderBy } from '~/@/db/interface/query-input/order-by'
import { Where } from '~/@/db/interface/query-input/where'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { isErr, mapErr, Ok, Result } from '~/@/result' // Removed 'Result' as it's a namespace for types here
import { ascend } from '~/@/sort'
import { ISqlDb } from '~/@/sql-db/interface'
import { SqlDbParam } from '~/@/sql-db/sql-db-param'
import { toBulkInsertSql } from '~/@/sql/bulk-insert'
import { Db } from '../interface'
import { QueryInput } from '../interface/query-input/query-input'
import { QueryOutput } from '../interface/query-output/query-output'

export type Config<
  TField extends string,
  TEntity extends Record<string, unknown>,
  TRelated,
  TRow,
> = {
  parser: Db.Parser<TField, TEntity, TRelated>
  sqlDb: ISqlDb
  viewName: string
  primaryKey: string
  migration?: {
    up: string
    down: string
    policy: IMigrationPolicy
  }
  fieldToSqlColumn: (field: TField) => string
  rowParser: z.ZodType<TRow>
  rowToEntity: (row: TRow) => TEntity
  entityToRow: (entity: TEntity) => TRow
}

export const createDbFromSqlDb = <
  TField extends string,
  TEntity extends Record<string, unknown>,
  TRelated,
  TRow,
>(
  config: Config<TField, TEntity, TRelated, TRow>
): Db.Db<TField, TEntity, TRelated> => {
  const run = config.migration?.policy.run({
    sqlDb: config.sqlDb,
    up: config.migration.up,
    down: config.migration.down,
  })
  const mapOutput = (
    queryInput: QueryInput<TField>,
    dbOutput: Result<{ rows: TRow[] }, Error>
  ): QueryOutput<TEntity, TRelated> => {
    if (isErr(dbOutput)) return mapErr(dbOutput, DbErr.from)

    const entities = dbOutput.value.rows.map(config.rowToEntity)
    const output: QueryOutput<TEntity, TRelated> = Ok({
      entities: {
        items: entities,
        total: entities.length,
        limit: queryInput.limit ?? 0,
        offset: queryInput.offset ?? 0,
      },
      related: config.parser.Related.parse({}),
    })

    return output
  }

  const toSql = (queryInput: QueryInput<TField>) => {
    const params: SqlDbParam[] = [queryInput.limit, queryInput.offset]
    const whereClause = queryInput.where
      ? Where.toSql(queryInput.where, config.fieldToSqlColumn)
      : ''

    const orderByClause = queryInput.orderBy
      ? OrderBy.toSql(queryInput.orderBy, config.fieldToSqlColumn)
      : ''

    const sql = `
      SELECT *
      FROM ${config.viewName}
      ${whereClause}
      ${orderByClause}
      LIMIT $1
      OFFSET $2
    `

    return {
      sql,
      params,
    }
  }

  return {
    async query(queryInput) {
      await run
      const { sql, params } = toSql(queryInput)
      console.log(sql)
      const queryResult = await config.sqlDb.query({ sql, params, parser: config.rowParser })
      const output = mapOutput(queryInput, queryResult)
      return output
    },

    liveQuery(queryInput) {
      const { sql, params } = toSql(queryInput)
      return config.sqlDb
        .liveQuery({ sql, params, parser: config.rowParser, waitFor: run })
        .map((queryResult) => mapOutput(queryInput, queryResult))
    },

    async upsert(input) {
      await run
      const params = input.entities.map((entity) => {
        const entries = Object.entries(entity)
        const sortedEntries = entries.sort(ascend(([key]) => key))
        const values = sortedEntries
          .map(([_key, value]) => value)
          .map((value) => SqlDbParam.to(value))

        return values
      })
      const { params: flatParams, variables } = toBulkInsertSql({
        params,
      })

      const entity = input.entities[0]

      if (!entity) {
        return Ok({ entities: [] })
      }

      const sqlColumns = [entity].flatMap((entity) => {
        const entries = Object.entries(entity)
        const sortedEntries = entries.sort(ascend(([key]) => key))
        const fields = sortedEntries.map(([key]) => key)
        return fields.map((field) => config.fieldToSqlColumn(field as TField))
      })

      const sql = `
INSERT INTO ${config.viewName} (
  ${sqlColumns.map((column) => `\t${column}`).join(',\n')}
)
VALUES
${variables}
ON CONFLICT (${config.primaryKey}) DO UPDATE SET
  ${sqlColumns.map((column) => `\t${column} = EXCLUDED.${column}`).join(',\n')}
`

      console.log(sql)

      const queried = await config.sqlDb.query({ sql, params: flatParams, parser: z.unknown() })

      if (isErr(queried)) return mapErr(queried, DbErr.from)

      return Ok({
        entities: input.entities,
      })
    },
  }
}
