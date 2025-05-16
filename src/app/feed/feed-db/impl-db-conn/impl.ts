import { z } from 'zod'
import { SqlDbParam, ISqlDb } from '~/@/sql-db/interface'
import { ILogger } from '~/@/logger'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { isErr, Ok, Result } from '~/@/result'
import { toBulkInsertSql } from '~/@/sql/bulk-insert'
import { ClientSessionId } from '~/app/@/client-session-id/client-session-id'
import { Feed } from '../../feed'
import { IFeedDb } from '../interface/interface'
import { FeedColumn, FeedDbQueryInput } from '../interface/query-input'
import { FeedDbQueryOutput } from '../interface/query-output'
import { Where } from '~/@/db/interface/query-input/where'
import { OrderBy } from '~/@/db/interface/query-input/order-by'

export type Config = {
  t: 'db-conn'
  sqlDb: ISqlDb
  migrationPolicy: IMigrationPolicy
  logger: ILogger
}

const up = `
CREATE TABLE IF NOT EXISTS feed (
  id TEXT PRIMARY KEY,
  client_session_id TEXT NOT NULL,
  active_index INTEGER NOT NULL,
  created_at_posix REAL NOT NULL,
  updated_at_posix REAL
)
`
const down = `
DROP TABLE IF EXISTS feed CASCADE
`

const Row = z.object({
  id: z.string(),
  client_session_id: z.string(),
  active_index: z.number().int().min(0),
})

type Row = z.infer<typeof Row>

const rowToFeed = (row: Row): Feed => {
  return {
    id: row.id,
    clientSessionId: ClientSessionId.fromString(row.client_session_id),
    activeIndex: row.active_index,
  }
}

const feedColumnToSqlColumn = (column: FeedColumn): string => {
  switch (column) {
    case 'id': {
      return 'id'
    }
    case 'client-session-id': {
      return 'client_session_id'
    }
    default: {
      throw new Error('Unreachable')
    }
  }
}

export const FeedDb = (config: Config): IFeedDb => {
  const run = config.migrationPolicy.run({ sqlDb: config.sqlDb, up, down })

  return {
    async query(input) {
      await run
      const { sql, params } = toSqlDbInput(input)
      const queried = await config.sqlDb.query({
        sql,
        params,
        parser: Row,
      })
      return fromSqlDbOutput({ queried, query: input })
    },
    liveQuery(query) {
      const { sql, params } = toSqlDbInput(query)
      return config.sqlDb.liveQuery({ sql, params, parser: Row }).map((queried) => {
        return fromSqlDbOutput({ queried, query })
      })
    },
    async upsert(feed) {
      await run
      const { params, variables } = toBulkInsertSql({
        params: feed.map((feed) => [feed.id, feed.clientSessionId, feed.activeIndex, Date.now()]),
      })
      const result = await config.sqlDb.query({
        sql: `
          INSERT INTO feed (
            id,
            client_session_id,
            active_index,
            created_at_posix
          ) VALUES ${variables}
          ON CONFLICT (id) DO UPDATE SET
            client_session_id = EXCLUDED.client_session_id,
            active_index = EXCLUDED.active_index,
            updated_at_posix = EXCLUDED.updated_at_posix
        `,
        params,
        parser: z.unknown(),
      })

      if (isErr(result)) return result
      return Ok(null)
    },
  }
}

const fromSqlDbOutput = (input: {
  queried: Result<{ rows: Row[] }, Error>
  query: FeedDbQueryInput
}): FeedDbQueryOutput => {
  if (isErr(input.queried)) return input.queried
  return Ok({
    items: input.queried.value.rows.map(rowToFeed),
    total: input.queried.value.rows.length,
    offset: input.query.offset,
    limit: input.query.limit,
  })
}

const toSqlDbInput = (input: FeedDbQueryInput) => {
  const whereStr = input.where ? Where.toSql(input.where, feedColumnToSqlColumn) : ''
  const orderByStr = input.orderBy ? OrderBy.toSql(input.orderBy, feedColumnToSqlColumn) : ''
  const sql = `
    SELECT id, client_session_id, active_index 
    FROM feed 
    ${whereStr}
    ${orderByStr}
    LIMIT $1
    OFFSET $2
  `
  const params: SqlDbParam[] = [input.limit, input.offset]
  return {
    sql,
    params,
  }
}
