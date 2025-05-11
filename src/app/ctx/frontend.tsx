import { PGlite } from '@electric-sql/pglite'
import { createContext, useContext } from 'react'
import { DbConn } from '~/@/db-conn/impl'
import { IDbConn } from '~/@/db-conn/interface'
import { FrontendMediaDb } from '../media/media-db/frontend'
import { IMediaDb } from '../media/media-db/interface'
import { ILogger, Logger } from '~/@/logger'

export type Ctx = {
  isProd: boolean
  mediaDb: IMediaDb
  dbConn: IDbConn
  logger: ILogger
}

const init = (): Ctx => {
  const mediaDb = FrontendMediaDb({ t: 'trpc-client' })

  const pglite = new PGlite()

  const dbConn = DbConn({ t: 'pglite', pglite })

  const isProd = process.env.NODE_ENV === 'production'

  const logger = Logger.prefix('app', Logger({ type: 'console' }))

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
