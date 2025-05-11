import { PGlite } from '@electric-sql/pglite'
import { createContext, useContext } from 'react'
import { DbConn } from '~/@/db-conn/impl'
import { IDbConn } from '~/@/db-conn/interface'
import { ILogger, Logger } from '~/@/logger'
import { MediaDbFrontend } from '../media/media-db/frontend'
import { IMediaDb } from '../media/media-db/interface'
import { TrpcClient } from '../trpc/frontend/trpc-client'

export type Ctx = {
  isProd: boolean
  mediaDb: IMediaDb
  dbConn: IDbConn
  logger: ILogger
}

const init = (): Ctx => {
  const logger = Logger.prefix('app', Logger({ type: 'console' }))

  const pglite = new PGlite()

  const dbConn = DbConn({ t: 'pglite', pglite })

  const trpcClient = TrpcClient()

  const mediaDb = MediaDbFrontend({
    t: 'sync-reads',
    local: MediaDbFrontend({ t: 'db-conn', dbConn }),
    remote: MediaDbFrontend({ t: 'trpc-client', trpcClient }),
  })

  const isProd = process.env.NODE_ENV === 'production'

  return {
    mediaDb,
    isProd,
    dbConn,
    logger,
  }
}

const Context = createContext<Ctx>(init())

const Provider = (props: { children: React.ReactNode; ctx: Ctx }) => {
  return <Context.Provider value={props.ctx}>{props.children}</Context.Provider>
}

export const useCtx = () => {
  return useContext(Context)
}

export const Ctx = {
  init,
  Provider,
  useCtx,
}
