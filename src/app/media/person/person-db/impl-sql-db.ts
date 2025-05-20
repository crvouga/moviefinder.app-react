import { z } from 'zod'
import { Db } from '~/@/db/impl/impl'
import { ImageSet } from '~/@/image-set'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { ISqlDb } from '~/@/sql-db/interface'
import { IPersonDb } from './interface'
import { exhaustive } from '~/@/exhaustive-check'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  logger: ILogger
  kvDb: IKvDb
}

const up = `
CREATE TABLE IF NOT EXISTS person (
    id TEXT PRIMARY KEY,
    name TEXT,
    popularity REAL,
    profile_urls TEXT[]
)
`

const down = `
DROP TABLE IF EXISTS person CASCADE
`

const Row = z.object({
  id: z.string(),
  name: z.string().nullable(),
  popularity: z.number().nullable(),
  profile_urls: z.array(z.string()).nullable(),
})

export const PersonDb = (config: Config): IPersonDb => {
  return Db({
    t: 'sql-db',
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
      up: [up],
      down: [down],
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
          return 'profile_urls'
        default:
          return exhaustive(key)
      }
    },
    rowParser: Row,
    rowToEntity(row) {
      return {
        id: row.id,
        name: row.name,
        popularity: row.popularity,
        profile: ImageSet.init({
          lowestToHighestRes: row.profile_urls ?? [],
        }),
      }
    },
    primaryKey: 'id',
    entityToRow(entity) {
      return {
        id: entity.id,
        name: entity.name,
        popularity: entity.popularity,
        profile_urls: entity.profile.lowestToHighestRes,
      }
    },
  })
}
