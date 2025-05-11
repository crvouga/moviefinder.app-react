import { z } from 'zod'
import { IDbConn } from '~/@/db-conn/interface'
import { isErr, mapErr, Ok } from '~/@/result'
import { AppErr } from '~/app/@/error'
import { Media } from '../../media'
import { IMediaDb } from '../interface/interface'
import { Row } from './row'

export type Config = {
  t: 'db-conn'
  dbConn: IDbConn
  shouldCreateTable: boolean
}

export const MediaDb = (config: Config): IMediaDb => {
  if (config.shouldCreateTable) {
    config.dbConn.query({
      sql: `
      CREATE TABLE IF NOT EXISTS media (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        poster_urls TEXT[] NOT NULL,
        backdrop_urls TEXT[] NOT NULL
      )
    `,
      params: [],
      parser: z.unknown(),
    })
  }

  return {
    async query(query) {
      const sql = `
      SELECT
        id,
        title,
        description,
        poster_urls,
        backdrop_urls
      FROM media
      LIMIT $1 
      OFFSET $2
      `

      const params = [query.limit, query.offset]

      const queried = await config.dbConn.query({
        sql,
        params: params,
        parser: Row.parser,
      })

      if (isErr(queried)) return mapErr(queried, AppErr.from)

      const media = queried.value.rows.map((row): Media => {
        const media = Row.toMedia(row)
        return media
      })

      return Ok({
        media: {
          items: media,
          total: media.length,
          limit: query.limit,
          offset: query.offset,
        },
      })
    },
    async upsert(input) {
      const paramsNested = input.media.map((media) => [
        media.id,
        media.title,
        media.description,
        media.poster.lowestToHighestRes,
        media.backdrop.lowestToHighestRes,
      ])

      const variables = paramsNested
        .map((params, i) => {
          const offset = i * params.length
          const paramsStr = params.map((_param, i) => `$${offset + i + 1}`).join(',')
          return `(${paramsStr})`
        })
        .join(',')

      const params = paramsNested.flat()

      const sql = `
      INSERT INTO media (
        id,
        title,
        description,
        poster_urls,
        backdrop_urls
      )
      VALUES ${variables}
      ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      poster_urls = EXCLUDED.poster_urls,
      backdrop_urls = EXCLUDED.backdrop_urls
      `

      const queried = await config.dbConn.query({ sql, params, parser: z.unknown() })

      if (isErr(queried)) return mapErr(queried, AppErr.from)

      return Ok(null)
    },
  }
}
