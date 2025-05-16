import { z } from 'zod'
import { createDbFromSqlDb } from '~/@/db/impl/impl-sql-db'
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
    fieldToSqlColumn: {
      id: 'id',
      name: 'name',
      popularity: 'popularity',
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
