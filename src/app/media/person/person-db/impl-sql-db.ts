import { z } from 'zod'
import { createDbFromSqlDb } from '~/@/db/impl/create-db-from-sql-db'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { ISqlDb } from '~/@/sql-db/interface'
import { IPersonDb } from './interface'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  logger: ILogger
  kvDb: IKvDb
}

const up = `
CREATE TABLE IF NOT EXISTS person (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
)
`

const down = `
DROP TABLE IF EXISTS person
`

export const PersonDb = (config: Config): IPersonDb => {
  return createDbFromSqlDb({
    getRelated: async () => ({}),
    parser: IPersonDb.parser,
    sqlDb: config.sqlDb,
    viewName: 'person',
    migration: {
      policy: MigrationPolicy({
        t: 'dangerously-wipe-on-new-schema',
        logger: config.logger,
        kvDb: config.kvDb,
      }),
      up,
      down,
    },
    entityKeyToSqlColumn: (key) => {
      switch (key) {
        case 'id':
          return 'id'
        case 'name':
          return 'name'
        case 'popularity':
          return 'popularity'
        case 'profile':
          return 'profile'
        default:
          throw new Error(`Unreachable: ${key}`)
      }
    },
    rowParser: z.object({
      id: z.string(),
      name: z.string(),
      popularity: z.number().nullable(),
      profile: z.string(),
    }),
    rowToEntity(row) {
      return {
        id: row.id,
        name: row.name,
        popularity: row.popularity,
        profile: {
          lowestToHighestRes: [],
        },
      }
    },
    fieldToSqlColumn: (field) => {
      switch (field) {
        case 'id':
          return 'id'
        case 'name':
          return 'name'
        case 'popularity':
          return 'popularity'
      }
    },
    primaryKey: 'id',
    entityToRow(entity) {
      return {
        id: entity.id,
        name: entity.name ?? '',
        popularity: entity.popularity,
        profile: '',
      }
    },
  })
}
