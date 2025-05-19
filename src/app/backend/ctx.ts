import { SqlDb } from '~/@/sql-db/impl'
import { ISqlDb } from '~/@/sql-db/interface'
import { ILogger, Logger } from '~/@/logger'
import { PgliteInstance } from '~/@/pglite/pglite-instance'
import { TmdbClient } from '~/@/tmdb-client'
import { TmdbApiKey } from '~/@/tmdb-client/@/api-key'
import { MediaDbBackend } from '../media/media/media-db/impl/backend'
import { IMediaDb } from '../media/media/media-db/interface/interface'

export type Ctx = {
  mediaDb: IMediaDb
  logger: ILogger
  isProd: boolean
  sqlDb: ISqlDb
}

const init = (): Ctx => {
  const logger = Logger({ t: 'console', prefix: ['app'] })

  const TMDB_API_READ_ACCESS_TOKEN = TmdbApiKey.parse(process.env.TMDB_API_READ_ACCESS_TOKEN)

  const tmdbClient = TmdbClient({ readAccessToken: TMDB_API_READ_ACCESS_TOKEN })

  const mediaDb = MediaDbBackend({ t: 'tmdb-client', tmdbClient })

  const isProd = process.env.NODE_ENV === 'production'

  const pglite = PgliteInstance({ t: 'in-memory' })

  const sqlDb = SqlDb({ t: 'pglite', pglite, logger })

  return {
    mediaDb,
    logger,
    isProd,
    sqlDb,
  }
}

export const Ctx = {
  init,
}
