import { z } from 'zod'
import { Db } from '~/@/db/impl/impl'
import { ILogger } from '~/@/logger'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { ISqlDb } from '~/@/sql-db/interface'
import { ClientSessionId } from '~/app/@/client-session-id/client-session-id'
import { IFeedDb } from './interface'
import { Feed } from '../feed'
import { FeedId } from '../feed-id'
import { exhaustive } from '~/@/exhaustive-check'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  migrationPolicy: IMigrationPolicy
  logger: ILogger
}

const up = `
CREATE TABLE IF NOT EXISTS feed (
  id TEXT PRIMARY KEY,
  client_session_id TEXT NOT NULL,
  active_index INTEGER NOT NULL
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

export const FeedDb = (config: Config): IFeedDb => {
  return Db({
    t: 'sql-db',
    sqlDb: config.sqlDb,
    parser: IFeedDb.parser,
    rowParser: Row,
    entityToRow: (entity) => {
      return {
        id: entity.id,
        client_session_id: entity.clientSessionId.toString(),
        active_index: entity.activeIndex,
      }
    },
    entityKeyToSqlColumn: (field) => {
      switch (field) {
        case 'id': {
          return 'id'
        }
        case 'clientSessionId': {
          return 'client_session_id'
        }
        case 'activeIndex': {
          return 'active_index'
        }
        default: {
          return exhaustive(field)
        }
      }
    },

    rowToEntity: (row): Feed => {
      return {
        id: FeedId.fromString(row.id),
        clientSessionId: ClientSessionId.fromString(row.client_session_id),
        activeIndex: row.active_index,
      }
    },

    getRelated: async (_entities) => {
      return {}
    },

    viewName: 'feed',
    primaryKey: 'id',
    migration: {
      down: [down],
      up: [up],
      policy: config.migrationPolicy,
    },
  })
}
