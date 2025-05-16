import { DbConn } from '~/@/sql-db/impl'
import { IDbConn } from '~/@/sql-db/interface'
import { ILogger, Logger } from '~/@/logger'
import { createPglite } from '~/@/pglite/create-pglite'
import { TmdbClient } from '~/@/tmdb-client'
import { TmdbApiKey } from '~/@/tmdb-client/@/api-key'
import { MediaDbBackend } from '../media/media-db/impl/backend'
import { IMediaDb } from '../media/media-db/interface/interface'

export type Ctx = {
  mediaDb: IMediaDb
  logger: ILogger
  isProd: boolean
  dbConn: IDbConn
}

const init = (): Ctx => {
  const logger = Logger.prefix('app', Logger({ t: 'console' }))

  const TMDB_API_READ_ACCESS_TOKEN = TmdbApiKey.parse(process.env.TMDB_API_READ_ACCESS_TOKEN)

  const tmdbClient = TmdbClient({ readAccessToken: TMDB_API_READ_ACCESS_TOKEN })

  const mediaDb = MediaDbBackend({ t: 'tmdb-client', tmdbClient })

  const isProd = process.env.NODE_ENV === 'production'

  const pglite = createPglite({ t: 'in-memory' })

  const dbConn = DbConn({ t: 'pglite', pglite, logger })

  return {
    mediaDb,
    logger,
    isProd,
    dbConn,
  }
}

export const Ctx = {
  init,
}
