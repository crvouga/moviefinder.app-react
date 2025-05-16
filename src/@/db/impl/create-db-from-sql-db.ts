import { z } from 'zod'
import { DbErr } from '~/@/db/interface/error'
import { OrderBy } from '~/@/db/interface/query-input/order-by'
import { Where } from '~/@/db/interface/query-input/where'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { isErr, mapErr, Ok, Result, unwrapOr } from '~/@/result'
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
  entityKeyToSqlColumn: (key: keyof TEntity) => string
  rowParser: z.ZodType<TRow>
  rowToEntity: (row: TRow) => TEntity
  entityToRow: (entity: TEntity) => TRow
  getRelated: (entities: TEntity[]) => Promise<TRelated>
}

export const createDbFromSqlDb = <
  TField extends string,
  TEntity extends Record<string, unknown>,
  TRelated,
  TRow extends Record<string, unknown>,
>(
  config: Config<TField, TEntity, TRelated, TRow>
): Db.Db<TField, TEntity, TRelated> => {
  const run = config.migration?.policy.run({
    sqlDb: config.sqlDb,
    up: config.migration.up,
    down: config.migration.down,
  })
  const mapOutput = (input: {
    queryInput: QueryInput<TField>
    related: TRelated
    dbOutput: Result<{ rows: TRow[] }, Error>
  }): QueryOutput<TEntity, TRelated> => {
    const { queryInput, related, dbOutput } = input
    if (isErr(dbOutput)) return mapErr(dbOutput, DbErr.from)

    const entities = dbOutput.value.rows.map(config.rowToEntity)
    const output: QueryOutput<TEntity, TRelated> = Ok({
      entities: {
        items: entities,
        total: entities.length,
        limit: queryInput.limit ?? 0,
        offset: queryInput.offset ?? 0,
      },
      related,
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
      const dbOutput = await config.sqlDb.query({ sql, params, parser: config.rowParser })
      const entities = unwrapOr(dbOutput, (_) => ({ rows: [] })).rows.map(config.rowToEntity)
      const related = await config.getRelated(entities)
      const output = mapOutput({ queryInput, related, dbOutput })
      return output
    },

    liveQuery(queryInput) {
      const { sql, params } = toSql(queryInput)
      return config.sqlDb
        .liveQuery({ sql, params, parser: config.rowParser, waitFor: run })
        .mapAsync(async (dbOutput) => {
          const entities = unwrapOr(dbOutput, (_) => ({ rows: [] })).rows.map(config.rowToEntity)
          const related = await config.getRelated(entities)
          return mapOutput({ queryInput, related, dbOutput })
        })
    },

    async upsert(input) {
      await run
      const params = input.entities.map((entity) => {
        const row = config.entityToRow(entity)
        const rowEntries = Object.entries(row)
        const sortedRowEntries = rowEntries.sort(ascend(([key]) => key))
        const columnValues = sortedRowEntries
          .map(([_key, value]) => value)
          .map((value) => SqlDbParam.to(value))

        return columnValues
      })
      const { params: flatParams, variables } = toBulkInsertSql({
        params,
      })

      const entity = input.entities[0]

      if (!entity) {
        return Ok({ entities: [] })
      }

      const entries = Object.entries(entity)
      const sortedEntries = entries.sort(ascend(([key]) => key))
      const entityKeys = sortedEntries.map(([key]): keyof TEntity => key)
      const sqlColumns = entityKeys.map((key) => config.entityKeyToSqlColumn(key))

      const sql = `
INSERT INTO ${config.viewName} (
${sqlColumns.map((column) => `\t${column}`).join(',\n')}
)
VALUES
${variables}
ON CONFLICT (${config.primaryKey}) 
DO UPDATE SET
${sqlColumns.map((column) => `\t${column} = EXCLUDED.${column}`).join(',\n')}
`

      console.log(sql)
      console.log(flatParams)

      const queried = await config.sqlDb.query({ sql, params: flatParams, parser: z.unknown() })

      if (isErr(queried)) return mapErr(queried, DbErr.from)

      return Ok({
        entities: input.entities,
      })
    },
  }
}
