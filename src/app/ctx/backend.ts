import { ILogger, Logger } from '~/@/logger'
import { TmdbClient } from '~/@/tmdb-client'
import { TmdbApiKey } from '~/@/tmdb-client/@/api-key'
import { BackendMediaDb } from '../media/media-db/backend'
import { IMediaDb } from '../media/media-db/inter'

export type Ctx = {
  mediaDb: IMediaDb
  logger: ILogger
}

const init = (): Ctx => {
  const logger = Logger.prefix('app', Logger({ type: 'console' }))

  const TMDB_API_READ_ACCESS_TOKEN = TmdbApiKey.parse(process.env.TMDB_API_READ_ACCESS_TOKEN)

  const tmdbClient = TmdbClient({
    apiKey: TMDB_API_READ_ACCESS_TOKEN,
  })

  const mediaDb = BackendMediaDb({
    t: 'tmdb-client',
    tmdbClient,
  })

  return {
    mediaDb,
    logger,
  }
}

export const Ctx = {
  init,
}
