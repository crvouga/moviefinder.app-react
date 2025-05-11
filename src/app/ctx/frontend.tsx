import { createContext, useContext } from 'react'
import { DbConn } from '~/@/db-conn/impl'
import { IDbConn } from '~/@/db-conn/interface'
import { ILogger, Logger } from '~/@/logger'
import { createPglite } from '~/@/pglite/pglite'
import { MediaDbFrontend } from '../media/media-db/impl/frontend'
import { IMediaDb } from '../media/media-db/interface/interface'
import { TrpcClient } from '../trpc/frontend/trpc-client'
import { PubSub } from '~/@/pub-sub'

export type Ctx = {
  isProd: boolean
  mediaDb: IMediaDb
  dbConn: IDbConn
  logger: ILogger
}

const init = async (): Promise<Ctx> => {
  const isProd = process.env.NODE_ENV === 'production'

  const logger = Logger.prefix('app', Logger({ type: 'console' }))

  const pglite = await createPglite({ t: 'indexed-db', databaseName: 'db' })

  const dbConn = DbConn({ t: 'pglite', pglite })

  const backendUrl = isProd ? '' : 'http://localhost:8888'

  const trpcClient = TrpcClient({ backendUrl })

  const mediaDb = MediaDbFrontend({
    t: 'one-way-sync-remote-to-local',
    local: MediaDbFrontend({ t: 'db-conn', dbConn, shouldCreateTable: true }),
    remote: MediaDbFrontend({ t: 'trpc-client', trpcClient }),
    logger,
    pubSub: PubSub(),
  })

  return {
    mediaDb,
    isProd,
    dbConn,
    logger,
  }
}

const Context = createContext<Ctx | null>(null)

const Provider = (props: { children: React.ReactNode; ctx: Ctx }) => {
  return <Context.Provider value={props.ctx}>{props.children}</Context.Provider>
}

export const useCtx = (): Ctx => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('Ctx not found')
  return ctx
}

export const Ctx = {
  init,
  Provider,
  useCtx,
}
