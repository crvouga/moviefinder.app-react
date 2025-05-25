import { z } from 'zod'
import { Db } from '~/@/db/impl/impl'
import { exhaustive } from '~/@/exhaustive-check'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { ISqlDb } from '~/@/sql-db/interface'
import { VideoId } from '../video-id'
import { IVideoDb } from './interface'

export type Config = {
  t: 'sql-db'
  sqlDb: ISqlDb
  logger: ILogger
  kvDb: IKvDb
}

const up = [
  `
CREATE TABLE IF NOT EXISTS video (
    id TEXT PRIMARY KEY,
    iso_639_1 TEXT,
    iso_3166_1 TEXT,
    name TEXT,
    key TEXT,
    site TEXT,
    size INTEGER,
    type TEXT,
    official BOOLEAN,
    published_at TEXT,
    media_id TEXT NOT NULL,
    "order" INTEGER
)
`,
]

const down = [
  `
DROP TABLE IF EXISTS video CASCADE
`,
]

export const VideoDb = (config: Config): IVideoDb => {
  return Db({
    t: 'sql-db',
    getRelated: async () => ({}),
    parser: IVideoDb.parser,
    sqlDb: config.sqlDb,
    viewName: 'video',
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
        case 'iso_639_1':
          return 'iso_639_1'
        case 'iso_3166_1':
          return 'iso_3166_1'
        case 'name':
          return 'name'
        case 'key':
          return 'key'
        case 'site':
          return 'site'
        case 'size':
          return 'size'
        case 'type':
          return 'type'
        case 'official':
          return 'official'
        case 'publishedAt':
          return 'published_at'
        case 'mediaId':
          return 'media_id'
        case 'order':
          return 'order'
        default:
          return exhaustive(key)
      }
    },
    rowParser: z.object({
      id: z.string(),
      iso_639_1: z.string().nullable(),
      iso_3166_1: z.string().nullable(),
      name: z.string().nullable(),
      key: z.string().nullable(),
      site: z.string().nullable(),
      size: z.number().nullable(),
      type: z.string().nullable(),
      official: z.boolean().nullable(),
      published_at: z.string().nullable(),
      media_id: z.string(),
      order: z.number().nullable(),
    }),
    rowToEntity(row) {
      return {
        id: VideoId.fromString(row.id),
        iso_639_1: row.iso_639_1,
        iso_3166_1: row.iso_3166_1,
        name: row.name,
        key: row.key,
        site: row.site,
        size: row.size,
        type: row.type,
        official: row.official,
        publishedAt: row.published_at,
        mediaId: row.media_id,
        order: row.order ?? 0,
      }
    },
    primaryKey: 'id',
    entityToRow(entity) {
      return {
        id: entity.id,
        iso_639_1: entity.iso_639_1,
        iso_3166_1: entity.iso_3166_1,
        name: entity.name,
        key: entity.key,
        site: entity.site,
        size: entity.size,
        type: entity.type,
        official: entity.official,
        published_at: entity.publishedAt,
        media_id: entity.mediaId ?? null,
        order: entity.order,
      }
    },
  })
}
