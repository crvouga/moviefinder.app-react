import { ILogger, Logger } from '~/@/logger'
import { TmdbClient } from '~/@/tmdb-client'
import { TmdbApiKey } from '~/@/tmdb-client/@/api-key'
import { BackendMediaDb } from '../media/media-db/backend'
import { IMediaDb } from '../media/media-db/interface'

export type Ctx = {
  mediaDb: IMediaDb
  logger: ILogger
  isProd: boolean
}

const init = (): Ctx => {
  const logger = Logger.prefix('app', Logger({ type: 'console' }))

  const TMDB_API_READ_ACCESS_TOKEN = TmdbApiKey.parse(process.env.TMDB_API_READ_ACCESS_TOKEN)

  const tmdbClient = TmdbClient({ readAccessToken: TMDB_API_READ_ACCESS_TOKEN })

  const mediaDb = BackendMediaDb({ t: 'tmdb-client', tmdbClient })

  const isProd = process.env.NODE_ENV === 'production'

  return {
    mediaDb,
    logger,
    isProd,
  }
}

export const Ctx = {
  init,
}
