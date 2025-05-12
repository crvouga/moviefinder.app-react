import { DbConn } from '~/@/db-conn/impl'
import { IDbConn } from '~/@/db-conn/interface'
import { ILogger, Logger } from '~/@/logger'
import { createPglite } from '~/@/pglite/pglite'
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

const init = async (): Promise<Ctx> => {
  const logger = Logger.prefix('app', Logger({ type: 'console' }))

  const TMDB_API_READ_ACCESS_TOKEN = TmdbApiKey.parse(process.env.TMDB_API_READ_ACCESS_TOKEN)

  const tmdbClient = TmdbClient({ readAccessToken: TMDB_API_READ_ACCESS_TOKEN })

  const mediaDb = MediaDbBackend({ t: 'tmdb-client', tmdbClient })

  const isProd = process.env.NODE_ENV === 'production'

  const pglite = await createPglite({ t: 'in-memory' })

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
