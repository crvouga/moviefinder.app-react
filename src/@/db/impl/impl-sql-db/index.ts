import { z } from 'zod'
import { DbErr } from '~/@/db/interface/error'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { isErr, mapErr, Ok, Result, unwrapOr } from '~/@/result'
import { ascend } from '~/@/sort'
import { ISqlDb } from '~/@/sql-db/interface'
import { SqlDbParam } from '~/@/sql-db/sql-db-param'
import { toBulkInsertSql } from '~/@/sql/bulk-insert'
import { IDb } from '../../interface'
import { QueryInput } from '../../interface/query-input/query-input'
import { QueryOutput } from '../../interface/query-output/query-output'
import { toOrderBySql } from './order-by-sql'
import { quoteIfPostgresKeyword } from './postgres-keywords'
import { toWhereSql } from './where-sql'

export type Config<
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
  TRow extends Record<string, unknown>,
> = {
  t: 'sql-db'
  parser: IDb.Parser<TEntity, TRelated>
  sqlDb: ISqlDb
  viewName: string
  primaryKey: string
  migration?: {
    up: string[]
    down: string[]
    policy: IMigrationPolicy
  }
  entityKeyToSqlColumn: (key: keyof TEntity) => keyof TRow
  rowParser: z.ZodType<TRow>
  rowToEntity: (row: TRow) => TEntity
  entityToRow: (entity: TEntity) => TRow
  getRelated: (entities: TEntity[]) => Promise<TRelated>
  computedColumnKeys?: (keyof TRow)[]
}

export const Db = <
  TEntity extends Record<string, unknown>,
  TRelated extends Record<string, unknown>,
  TRow extends Record<string, unknown>,
>(
  config: Config<TEntity, TRelated, TRow>
): IDb.IDb<TEntity, TRelated> => {
  const run = config.migration?.policy.run({
    sqlDb: config.sqlDb,
    up: config.migration.up,
    down: config.migration.down,
  })
  const mapOutput = (input: {
    queryInput: QueryInput<TEntity>
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

  const toSql = (queryInput: QueryInput<TEntity>) => {
    const params: SqlDbParam[] = [queryInput.limit, queryInput.offset]
    const whereClause = queryInput.where
      ? toWhereSql(queryInput.where, config.entityKeyToSqlColumn)
      : ''

    const orderByClause = queryInput.orderBy
      ? toOrderBySql(queryInput.orderBy, config.entityKeyToSqlColumn)
      : ''

    const sql = [
      'SELECT *',
      `FROM ${config.viewName}`,
      whereClause,
      orderByClause,
      'LIMIT $1',
      'OFFSET $2',
    ]
      .filter(Boolean)
      .join('\n')

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
        const sortedRowEntries = rowEntries.sort(ascend(([sqlColumn]) => sqlColumn))

        const columnValues = sortedRowEntries
          .filter(([sqlColumn]) => !config.computedColumnKeys?.includes(sqlColumn))
          .map(([_sqlColumn, value]) => SqlDbParam.to(value))

        return columnValues
      })
      const { params: flatParams, variables } = toBulkInsertSql({
        params,
      })

      const entity = input.entities[0]

      if (!entity) return Ok({ entities: [] })

      const entries = Object.entries(entity)
      const sortedEntries = entries.sort(ascend(([key]) => key))
      const entityKeys = sortedEntries.map(([key]): keyof TEntity => key)
      const sqlColumns = entityKeys.flatMap((key): (keyof TRow)[] => {
        const sqlColumn = config.entityKeyToSqlColumn(key)

        if (!sqlColumn) return []

        const isComputedColumn = config.computedColumnKeys?.includes(sqlColumn)

        if (isComputedColumn) return []

        return [sqlColumn]
      })

      const sql = `
INSERT INTO ${config.viewName} (
${sqlColumns.map((column) => `\t${quoteIfPostgresKeyword(column)}`).join(',\n')}
)
VALUES
${variables}
ON CONFLICT (${config.primaryKey}) 
DO UPDATE SET
${sqlColumns.map((column) => `\t${quoteIfPostgresKeyword(column)} = EXCLUDED.${quoteIfPostgresKeyword(column)}`).join(',\n')}
`

      const queried = await config.sqlDb.query({ sql, params: flatParams, parser: z.unknown() })

      if (isErr(queried)) return mapErr(queried, DbErr.from)

      return Ok({
        entities: input.entities,
      })
    },
  }
}
