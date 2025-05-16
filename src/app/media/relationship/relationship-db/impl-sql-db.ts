import { z } from 'zod'
import { createDbFromSqlDb } from '~/@/db/impl/create-db-from-sql-db'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { ISqlDb } from '~/@/sql-db/interface'
import { IRelationshipDb } from './interface'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  logger: ILogger
  kvDb: IKvDb
}

const up = `
CREATE TYPE relationship_type AS ENUM ('recommendation', 'similar');
CREATE TABLE IF NOT EXISTS relationship (
    id TEXT PRIMARY KEY,
    from TEXT,
    to TEXT,
    type relationship_type
)
`

const down = `
DROP TABLE IF EXISTS relationship CASCADE
DROP TYPE IF EXISTS relationship_type CASCADE
`

const RelationshipTypePostgres = z.enum(['recommendation', 'similar'])

const Row = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  type: RelationshipTypePostgres,
})

export const RelationshipDb = (config: Config): IRelationshipDb => {
  return createDbFromSqlDb({
    getRelated: async () => ({}),
    parser: IRelationshipDb.parser,
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
        case 'from':
          return 'from'
        case 'to':
          return 'to'
        case 'type':
          return 'type'
        default:
          throw new Error(`Unreachable: ${key}`)
      }
    },
    rowParser: Row,
    rowToEntity(row) {
      return {
        id: row.id,
        from: row.from,
        to: row.to,
        type: row.type,
      }
    },
    fieldToSqlColumn: (field) => {
      switch (field) {
        case 'id':
          return 'id'
        case 'from':
          return 'from'
        case 'to':
          return 'to'
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
        from: entity.from,
        to: entity.to,
        type: entity.type,
      }
    },
  })
}
