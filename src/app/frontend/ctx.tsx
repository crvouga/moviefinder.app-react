import { createContext, useContext } from 'react'
import { DbConn } from '~/@/db-conn/impl'
import { IDbConn } from '~/@/db-conn/interface'
import { KeyValueDb } from '~/@/key-value-db/impl'
import { IKeyValueDb } from '~/@/key-value-db/interface'
import { ILogger, Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { createPglite } from '~/@/pglite/pglite'
import { PubSub } from '~/@/pub-sub'
import { unwrapOr } from '~/@/result'
import { ClientSessionId } from '../@/client-session-id/client-session-id'
import { ClientSessionIdStorage } from '../@/client-session-id/client-session-id-storage'
import { MediaDbFrontend } from '../media/media-db/impl/frontend'
import { IMediaDb } from '../media/media-db/interface/interface'
import { TrpcClient } from '../trpc/frontend/trpc-client'

export type Ctx = {
  isProd: boolean
  mediaDb: IMediaDb
  dbConn: IDbConn
  logger: ILogger
  keyValueDb: IKeyValueDb
  clientSessionId: ClientSessionId
}

const init = async (): Promise<Ctx> => {
  const isProd = import.meta.env.VITE_NODE_ENV === 'production'

  const logger = Logger.prefix('app', Logger({ type: 'console' }))

  const pglite = await createPglite({ t: 'indexed-db', databaseName: 'db' })

  const dbConn = DbConn({ t: 'pglite', pglite, logger })

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? ''

  const trpcClient = TrpcClient({ backendUrl })

  const keyValueDb = KeyValueDb({
    t: 'db-conn',
    dbConn,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger }),
  })

  const clientSessionIdStorage = ClientSessionIdStorage({ keyValueDb })

  const clientSessionId =
    unwrapOr(await clientSessionIdStorage.get(), () => null) ?? ClientSessionId.generate()

  await clientSessionIdStorage.set(clientSessionId)

  const mediaDb = MediaDbFrontend({
    t: 'one-way-sync-remote-to-local',
    local: MediaDbFrontend({
      t: 'db-conn',
      dbConn,
      migrationPolicy: MigrationPolicy({ t: 'dangerously-wipe-on-new-schema', keyValueDb, logger }),
    }),
    remote: MediaDbFrontend({ t: 'trpc-client', trpcClient }),
    logger,
    pubSub: PubSub(),
  })

  return {
    keyValueDb,
    mediaDb,
    isProd,
    dbConn,
    logger,
    clientSessionId,
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
