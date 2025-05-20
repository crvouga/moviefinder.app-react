import { z } from 'zod'
import { Db } from '~/@/db/impl/impl'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { isErr } from '~/@/result'
import { ISqlDb } from '~/@/sql-db/interface'
import { IMediaDb } from '../../media/media-db/interface/interface'
import { IRelationshipDb } from './interface'
import { exhaustive } from '~/@/exhaustive-check'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  logger: ILogger
  kvDb: IKvDb
  mediaDb: IMediaDb
}

const up = [
  `
CREATE TYPE relationship_type AS ENUM ('recommendation', 'similar');
`,
  `
CREATE TABLE IF NOT EXISTS relationship (
    id TEXT PRIMARY KEY,
    "from" TEXT,
    "to" TEXT,
    type relationship_type,
    "order" INTEGER
);
`,
]

const down = [
  `
DROP TABLE IF EXISTS relationship CASCADE;
`,
  `
DROP TYPE IF EXISTS relationship_type CASCADE;
`,
]

const RelationshipTypePostgres = z.enum(['recommendation', 'similar'])

const Row = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  type: RelationshipTypePostgres,
  order: z.number().nullable(),
})

export const RelationshipDb = (config: Config): IRelationshipDb => {
  return Db({
    t: 'sql-db',
    getRelated: async (entities) => {
      const media = await config.mediaDb.query({
        limit: Math.max(entities.length, 1),
        offset: 0,
        where: {
          op: 'in',
          column: 'id',
          value: entities.map((e) => e.to),
        },
        orderBy: [{ column: 'id', direction: 'asc' }],
      })
      if (isErr(media)) return { media: {} }

      const mediaMap = Object.fromEntries(media.value.entities.items.map((m) => [m.id, m]))

      return {
        media: mediaMap,
      }
    },
    parser: IRelationshipDb.parser,
    sqlDb: config.sqlDb,
    viewName: 'relationship',
    migration: {
      policy: MigrationPolicy({
        t: 'dangerously-wipe-on-new-schema',
        logger: config.logger,
        kvDb: config.kvDb,
      }),
      up,
      down,
    },
    entityKeyToSqlColumn(key) {
      switch (key) {
        case 'id':
          return 'id'
        case 'from':
          return 'from'
        case 'to':
          return 'to'
        case 'type':
          return 'type'
        case 'order':
          return 'order'
        default:
          return exhaustive(key)
      }
    },
    rowParser: Row,
    rowToEntity(row) {
      return {
        id: row.id,
        from: row.from,
        to: row.to,
        type: row.type,
        order: row.order,
      }
    },
    primaryKey: 'id',
    entityToRow(entity) {
      return {
        id: entity.id,
        from: entity.from,
        to: entity.to,
        type: entity.type,
        order: entity.order,
      }
    },
  })
}
