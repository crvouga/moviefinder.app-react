import { z } from 'zod'
import { createDbFromSqlDb } from '~/@/db/impl/create-db-from-sql-db'
import { ImageSet } from '~/@/image-set'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { ISqlDb } from '~/@/sql-db/interface'
import { MediaId } from '../../media-id'
import { IMediaDb } from '../interface/interface'

export type Config = {
  t: 'db-conn'
  sqlDb: ISqlDb
  migrationPolicy: IMigrationPolicy
}

const up = `
CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  poster_urls TEXT[] NOT NULL,
  backdrop_urls TEXT[] NOT NULL,
  popularity REAL NOT NULL,
  release_date TEXT
)
`
const down = `
DROP TABLE IF EXISTS media CASCADE
`

const Row = z.object({
  id: z.string(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  poster_urls: z.array(z.string()).nullable(),
  backdrop_urls: z.array(z.string()).nullable(),
  popularity: z.number().nullable(),
  release_date: z.string().nullable(),
})

export type Row = z.infer<typeof Row>

export const MediaDb = (config: Config): IMediaDb => {
  return createDbFromSqlDb({
    parser: IMediaDb.parser,
    getRelated: async () => ({
      person: {},
      credit: {},
      relationship: {},
      related: {},
      video: {},
    }),
    rowParser: Row,
    rowToEntity: (row) => {
      return {
        id: MediaId.fromString(row.id),
        title: row.title,
        description: row.description,
        poster: ImageSet.init({
          lowestToHighestRes: row.poster_urls ?? [],
        }),
        backdrop: ImageSet.init({
          lowestToHighestRes: row.backdrop_urls ?? [],
        }),
        popularity: row.popularity,
        releaseDate: row.release_date,
      }
    },
    entityToRow: (entity) => {
      return {
        id: entity.id,
        title: entity.title ?? null,
        description: entity.description ?? null,
        poster_urls: entity.poster.lowestToHighestRes,
        backdrop_urls: entity.backdrop.lowestToHighestRes,
        popularity: entity.popularity,
        release_date: entity.releaseDate,
      }
    },
    entityKeyToSqlColumn: (key) => {
      switch (key) {
        case 'id':
          return 'id'
        case 'popularity':
          return 'popularity'
        case 'releaseDate':
          return 'release_date'
        case 'backdrop':
          return 'backdrop_urls'
        case 'poster':
          return 'poster_urls'
        case 'description':
          return 'description'
        case 'title':
          return 'title'
        default:
          throw new Error(`Unreachable: ${key}`)
      }
    },
    fieldToSqlColumn: (field) => {
      switch (field) {
        case 'id':
          return 'id'
        case 'popularity':
          return 'popularity'
        default:
          throw new Error(`Unreachable: ${field}`)
      }
    },
    sqlDb: config.sqlDb,
    viewName: 'media',
    primaryKey: 'id',
    migration: {
      up,
      down,
      policy: config.migrationPolicy,
    },
  })
}
