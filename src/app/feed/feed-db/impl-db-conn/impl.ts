import { z } from 'zod'
import { IDbConn } from '~/@/db-conn/interface'
import { ILogger } from '~/@/logger'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { isErr, Ok } from '~/@/result'
import { ClientSessionId } from '~/app/@/client-session-id/client-session-id'
import { Feed } from '../../feed'
import { IFeedDb } from '../interface'

export type Config = {
  t: 'db-conn'
  dbConn: IDbConn
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

export const FeedDb = (config: Config): IFeedDb => {
  const run = config.migrationPolicy.run({
    dbConn: config.dbConn,
    key: 'feed',
    up,
    down,
  })

  return {
    async get(feedId) {
      await run
      const result = await config.dbConn.query({
        sql: 'SELECT id, client_session_id, active_index FROM feed WHERE id = $1',
        params: [feedId],
        parser: Row,
      })

      if (isErr(result)) return result
      const row = result.value.rows[0]
      if (!row) return Ok(null)
      const feed = rowToFeed(row)
      return Ok(feed)
    },
    async put(feed) {
      await run
      const result = await config.dbConn.query({
        sql: `
          INSERT INTO feed (
            id,
            client_session_id,
            active_index,
            created_at_posix
          ) VALUES (
            $1,
            $2,
            $3,
            $4
          ) ON CONFLICT (id) DO UPDATE SET
            client_session_id = $2,
            active_index = $3,
            updated_at_posix = $4
        `,
        params: [feed.id, feed.clientSessionId, feed.activeIndex, Date.now()],
        parser: z.unknown(),
      })

      if (isErr(result)) return result
      return Ok(null)
    },
  }
}
