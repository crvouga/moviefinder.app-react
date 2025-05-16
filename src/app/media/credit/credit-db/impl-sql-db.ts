import { z } from 'zod'
import { createDbFromSqlDb } from '~/@/db/impl/create-db-from-sql-db'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { ISqlDb } from '~/@/sql-db/interface'
import { MediaId } from '../../media-id'
import { PersonId } from '../../person/person-id'
import { CreditId } from '../credit-id'
import { ICreditDb } from './interface'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  logger: ILogger
  kvDb: IKvDb
}

const up = [
  `CREATE TYPE credit_type AS ENUM ('cast', 'crew')`,
  `
CREATE TABLE IF NOT EXISTS credit (
    id TEXT PRIMARY KEY,
    media_id TEXT NOT NULL,
    person_id TEXT NOT NULL,
    job TEXT,
    character TEXT,
    "order" INTEGER,
    type credit_type NOT NULL
)
`,
]

const down = [
  `
DROP TABLE IF EXISTS credit CASCADE;
`,
  `
DROP TYPE IF EXISTS credit_type CASCADE;
`,
]

const CreditTypePostgres = z.enum(['cast', 'crew'])

const Row = z.object({
  id: z.string(),
  media_id: z.string(),
  person_id: z.string(),
  job: z.string().nullable(),
  character: z.string().nullable(),
  order: z.number().nullable(),
  type: CreditTypePostgres,
})

export const CreditDb = (config: Config): ICreditDb => {
  return createDbFromSqlDb({
    getRelated: async () => ({}),
    parser: ICreditDb.parser,
    sqlDb: config.sqlDb,
    viewName: 'credit',
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
        case 'mediaId':
          return 'media_id'
        case 'personId':
          return 'person_id'
        case 'job':
          return 'job'
        case 'character':
          return 'character'
        case 'order':
          return 'order'
        case 'type':
          return 'type'
        default:
          throw new Error(`Unreachable: ${key}`)
      }
    },
    rowParser: Row,
    rowToEntity(row) {
      return {
        id: CreditId.fromString(row.id),
        mediaId: MediaId.fromString(row.media_id),
        personId: PersonId.fromString(row.person_id),
        job: row.job,
        character: row.character,
        order: row.order,
        type: row.type,
      }
    },
    fieldToSqlColumn: (field) => {
      switch (field) {
        case 'id':
          return 'id'
        case 'mediaId':
          return 'media_id'
        case 'personId':
          return 'person_id'
        case 'job':
          return 'job'
        case 'character':
          return 'character'
        case 'order':
          return 'order'
        case 'type':
          return 'type'
        default:
          throw new Error(`Unreachable: ${field}`)
      }
    },
    primaryKey: 'id',
    entityToRow(entity) {
      return {
        id: entity.id,
        media_id: entity.mediaId,
        person_id: entity.personId,
        job: entity.job,
        character: entity.character,
        order: entity.order,
        type: entity.type,
      }
    },
  })
}
