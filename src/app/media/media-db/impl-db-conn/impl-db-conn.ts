import { z } from 'zod'
import { DbConnParam, IDbConn } from '~/@/sql-db/interface'
import { AppErr } from '~/@/error'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { OrderBy } from '~/@/query/query-input/order-by'
import { Where } from '~/@/query/query-input/where'
import { isErr, mapErr, Ok, Result } from '~/@/result'
import { toBulkInsertSql } from '~/@/sql/bulk-insert'
import { Media } from '../../media'
import { IMediaDb } from '../interface/interface'
import { MediaColumn, MediaDbQueryInput } from '../interface/query-input'
import { MediaDbQueryOutput } from '../interface/query-output'
import { Row } from './row'

export type Config = {
  t: 'db-conn'
  dbConn: IDbConn
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

export const MediaDb = (config: Config): IMediaDb => {
  const run = config.migrationPolicy.run({ dbConn: config.dbConn, up, down })
  return {
    async query(query) {
      await run

      const { sql, params } = toSqlQuery(query)

      const queried = await config.dbConn.query({
        sql,
        params: params,
        parser: Row.parser,
      })

      return toQueryOutput({ queried, query })
    },
    liveQuery(query) {
      const { sql, params } = toSqlQuery(query)
      return config.dbConn
        .liveQuery({ sql, params, parser: Row.parser, waitFor: run })
        .map((queried) => {
          return toQueryOutput({ queried, query })
        })
    },
    async upsert(input) {
      await run
      const { params, variables } = toBulkInsertSql({
        params: input.media.map((media) => [
          media.id,
          media.title,
          media.description,
          media.poster.lowestToHighestRes,
          media.backdrop.lowestToHighestRes,
          media.popularity,
          media.releaseDate,
        ]),
      })

      const sql = `
      INSERT INTO media (
        id,
        title,
        description,
        poster_urls,
        backdrop_urls,
        popularity,
        release_date
      )
      VALUES ${variables}
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        poster_urls = EXCLUDED.poster_urls,
        backdrop_urls = EXCLUDED.backdrop_urls,
        popularity = EXCLUDED.popularity,
        release_date = EXCLUDED.release_date
      `

      const queried = await config.dbConn.query({ sql, params, parser: z.unknown() })

      if (isErr(queried)) return mapErr(queried, AppErr.from)

      return Ok(null)
    },
  }
}

const toQueryOutput = (input: {
  queried: Result<{ rows: Row[] }, Error>
  query: MediaDbQueryInput
}): MediaDbQueryOutput => {
  if (isErr(input.queried)) return mapErr(input.queried, AppErr.from)

  const media = input.queried.value.rows.map((row): Media => {
    const media = Row.toMedia(row)
    return media
  })

  return Ok({
    media: {
      items: media,
      total: media.length,
      limit: input.query.limit,
      offset: input.query.offset,
    },
    person: {},
    credit: {},
    relationship: {},
    related: {},
    video: {},
  })
}

const mediaColumnToSqlColumn = (column: MediaColumn): string => {
  switch (column) {
    case 'id': {
      return 'id'
    }
    case 'popularity': {
      return 'popularity'
    }
    default: {
      throw new Error('Unreachable')
    }
  }
}

const toSqlQuery = (query: MediaDbQueryInput) => {
  const params: DbConnParam[] = [query.limit, query.offset]

  const sql = `
  SELECT
    id,
    title,
    description,
    poster_urls,
    backdrop_urls,
    popularity,
    release_date
  FROM media
  ${query.where ? Where.toSql(query.where, mediaColumnToSqlColumn) : ''}
  ${query.orderBy ? OrderBy .toSql(query.orderBy, mediaColumnToSqlColumn) : ''}
  LIMIT $1 
  OFFSET $2
  `

  return {
    sql,
    params,
  }
}
