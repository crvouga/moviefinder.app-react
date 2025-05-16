import { z } from 'zod'
import { DbErr } from '~/@/db/interface/error'
import { OrderBy } from '~/@/db/interface/query-input/order-by'
import { Where } from '~/@/db/interface/query-input/where'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { isErr, mapErr, Ok } from '~/@/result'; // Removed 'Result' as it's a namespace for types here
import { ISqlDb, SqlDbParam } from '~/@/sql-db/interface'
import { toBulkInsertSql } from '~/@/sql/bulk-insert'
import { Db } from '../interface'

export type Config<TField extends string, TEntity, TRelated, TRow> = {
    parser: Db.Parser<TField, TEntity, TRelated>
    sqlDb: ISqlDb
    viewName: string
    primaryKey: string
    migration: {
        up: string
        down: string
        policy: IMigrationPolicy
    }
    fieldToSqlColumn: {
        [key in TField]: string
    },
    rowParser: z.ZodType<TRow>
    rowToEntity: (row: TRow) => TEntity
    entityToRow: (entity: TEntity) => TRow
}

export const createDbFromSqlDb = <TField extends string, TEntity, TRelated, TRow>(
  config: Config<TField, TEntity, TRelated, TRow>
): Db.Db<TField, TEntity, TRelated> => {
  return {
    async query(queryInput) {

      const queryResult = await config.sqlDb.query({
        sql,
        params: queryParams,
        parser: config.Entity.Entity, // Assumes ISqlDb.query uses this to parse each row
      })

      if (isErr(queryResult)) return mapErr(queryResult, DbErr.from)

      const entities = queryResult.value.rows // Rows are already TEntity[]
      return Ok({
        entities: {
          items: entities,
          total: entities.length, // Consistent with MediaDb, represents returned items count
          limit: queryInput.limit,
          offset: queryInput.offset,
        },
        related: {}
      })
    },

    liveQuery(queryInput)    {


      return config.sqlDb
        .liveQuery({
          sql,
          params: queryParams,
          parser: config.Entity.Entity,
          waitFor: migrationPromiseForLiveQuery,
        })
        .map((queryResult) => {
          if (isErr(queryResult)) return mapErr(queryResult, DbErr.from)
          const entities = queryResult.value.rows
          return Ok({
            entities: {
              items: entities,
              total: entities.length,
              limit: queryInput.limit,
              offset: queryInput.offset,
            },
            related: {} as TRelated,
          })
        })
    },

    async upsert(input) {
      await runMigrationIfNeeded()

      if (input.entities.length === 0) {
        // MediaDb returns Ok(null). Db.UpsertOutput parser might expect { updated: TEntity[] }.
        // Following MediaDb pattern.
        return Ok(null)
      }

      const { params: flatParams, variables } = toBulkInsertSql({
        params: input.entities.map(config.entityToParams),
      })

      const columnNames = config.columnsForInsert.join(', ')
      const updateSetClauses = config.columnsForInsert
        .filter((col) => col !== config.primaryKeyColumn)
        .map((col) => `${col} = EXCLUDED.${col}`)
        .join(', ')

      let sql: string
      if (config.columnsForInsert.length > 0 && updateSetClauses.length === 0) {
        // All insertable columns are part of the primary key, or only PK is specified.
        // ON CONFLICT DO NOTHING is appropriate here.
        sql = `
          INSERT INTO ${config.viewName} (${columnNames})
          VALUES ${variables}
          ON CONFLICT (${config.primaryKeyColumn}) DO NOTHING
        `
      } else {
        sql = `
          INSERT INTO ${config.viewName} (${columnNames})
          VALUES ${variables}
          ON CONFLICT (${config.primaryKeyColumn}) DO UPDATE SET
            ${updateSetClauses}
        `
      }

      const upsertResult = await config.sqlDb.query({
        sql,
        params: flatParams,
        parser: z.unknown(), // Not expecting rows back, per MediaDb pattern
      })

      if (isErr(upsertResult)) return mapErr(upsertResult, DbErr.from)

      return Ok(null) // MediaDb pattern
    },
  }
}


const toSql =<TField extends string, TEntity, TRelated, TRow>(config: Config<TField, TEntity, TRelated, TRow>, queryInput: QueryInput<TField>) => {
    const params: SqlDbParam[] = [queryInput.limit, queryInput.offset]
    const whereClause = queryInput.where
      ? Where.toSql(queryInput.where, config.columnMap)
      : ''
    const orderByClause = queryInput.orderBy
      ? OrderBy.toSql(queryInput.orderBy, config.columnMap)
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
