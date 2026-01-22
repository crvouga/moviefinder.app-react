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

  // Lazy pglite initialization - only initialize when actually needed
  // This prevents WASM initialization errors from crashing the server on startup
  let pglitePromise: Promise<Awaited<ReturnType<typeof PgliteInstance>>> | null = null
  const getPglite = () => {
    if (!pglitePromise) {
      pglitePromise = PgliteInstance({ t: 'in-memory' }).catch((error) => {
        logger.error('Failed to initialize pglite (WASM may not be supported)', { error })
        throw error
      })
    }
    return pglitePromise
  }

  // Create a promise-like object that initializes on first access
  const pglite = {
    then: <T, R>(
      onFulfilled?: (value: Awaited<ReturnType<typeof PgliteInstance>>) => T | Promise<T>,
      onRejected?: (reason: any) => R | Promise<R>
    ) => getPglite().then(onFulfilled, onRejected),
    catch: <R>(onRejected?: (reason: any) => R | Promise<R>) => getPglite().catch(onRejected),
    finally: (onFinally?: () => void) => getPglite().finally(onFinally),
  } as Promise<Awaited<ReturnType<typeof PgliteInstance>>>

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
