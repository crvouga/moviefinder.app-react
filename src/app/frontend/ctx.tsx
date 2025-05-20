import { createContext, useContext } from 'react'
import { KvDb } from '~/@/kv-db/impl'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger, Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { PgliteInstance } from '~/@/pglite/pglite-instance'
import { PgliteWorkerInstance } from '~/@/pglite/pglite-worker-instance/pglite-worker-instance'
import { IPgliteInstance } from '~/@/pglite/types'
import { SqlDb } from '~/@/sql-db/impl'
import { ISqlDb } from '~/@/sql-db/interface'
import { TimeSpan } from '~/@/time-span'
import { ClientSessionId } from '../@/client-session-id/client-session-id'
import { ClientSessionIdStorage } from '../@/client-session-id/client-session-id-storage'
import { FeedDb } from '../feed/feed-db/impl'
import { IFeedDb } from '../feed/feed-db/interface'
import { CreditDb } from '../media/credit/credit-db/impl'
import { ICreditDb } from '../media/credit/credit-db/interface'
import { MediaDbFrontend } from '../media/media/media-db/impl/frontend'
import { IMediaDb } from '../media/media/media-db/interface/interface'
import { PersonDb } from '../media/person/person-db/impl'
import { IPersonDb } from '../media/person/person-db/interface'
import { RelationshipDb } from '../media/relationship/relationship-db/impl'
import { IRelationshipDb } from '../media/relationship/relationship-db/interface'
import { VideoDb } from '../media/video/video-db/impl'
import { IVideoDb } from '../media/video/video-db/interface'
import { TrpcClient } from '../trpc/frontend/trpc-client'

export type Ctx = {
  isProd: boolean
  mediaDb: IMediaDb
  sqlDb: ISqlDb
  logger: ILogger
  kvDb: IKvDb
  clientSessionId: ClientSessionId
  feedDb: IFeedDb
  personDb: IPersonDb
  relationshipDb: IRelationshipDb
  creditDb: ICreditDb
  videoDb: IVideoDb
  pglite: Promise<IPgliteInstance>
}

type Config = {
  storage: 'sql-db' | 'hash-map'
}

const init = (): Ctx => {
  let config: Config
  config ??= { storage: 'hash-map' }
  config ??= { storage: 'sql-db' }

  const isProd = import.meta.env.VITE_NODE_ENV === 'production'

  let logger: ILogger
  logger ??= Logger({ t: 'console', prefix: ['app'] })
  logger ??= Logger({ t: 'noop' })

  let pglite: Promise<IPgliteInstance>
  pglite ??= PgliteWorkerInstance({ t: 'indexed-db', databaseName: 'db' })
  pglite ??= PgliteInstance({ t: 'indexed-db', databaseName: 'db' })
  pglite ??= PgliteInstance({ t: 'in-memory' })
  pglite ??= PgliteWorkerInstance({ t: 'in-memory' })

  const sqlDb = SqlDb({ t: 'pglite', pglite, logger })

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? ''

  const trpcClient = TrpcClient({ backendUrl, logger })

  let migrationPolicy: IMigrationPolicy
  migrationPolicy = MigrationPolicy({ t: 'always-run', logger })

  let kvDb: IKvDb
  if (config.storage === 'hash-map') kvDb ??= KvDb({ t: 'hash-map', map: new Map() })
  if (config.storage === 'sql-db') kvDb ??= KvDb({ t: 'sql-db', sqlDb, migrationPolicy })
  kvDb ??= KvDb({ t: 'browser-storage', storage: localStorage })

  migrationPolicy = MigrationPolicy({ t: 'dangerously-wipe-on-new-schema', kvDb, logger })

  const clientSessionIdStorage = ClientSessionIdStorage({ storage: localStorage })
  const clientSessionId = clientSessionIdStorage.get() ?? ClientSessionId.generate()
  clientSessionIdStorage.set(clientSessionId)

  let mediaDbLocal: IMediaDb
  if (config.storage === 'hash-map') mediaDbLocal ??= MediaDbFrontend({ t: 'hash-map' })
  if (config.storage === 'sql-db')
    mediaDbLocal ??= MediaDbFrontend({ t: 'sql-db', sqlDb, migrationPolicy })
  mediaDbLocal ??= MediaDbFrontend({ t: 'hash-map' })

  let mediaDbRemote: IMediaDb
  mediaDbRemote ??= MediaDbFrontend({ t: 'trpc-client', trpcClient })

  let personDb: IPersonDb
  if (config.storage === 'hash-map') personDb ??= PersonDb({ t: 'hash-map' })
  if (config.storage === 'sql-db') personDb ??= PersonDb({ t: 'sql-db', sqlDb, logger, kvDb })
  personDb ??= PersonDb({ t: 'hash-map' })

  let relationshipDb: IRelationshipDb
  if (config.storage === 'hash-map')
    relationshipDb ??= RelationshipDb({ t: 'hash-map', mediaDb: mediaDbLocal })
  if (config.storage === 'sql-db')
    relationshipDb ??= RelationshipDb({ t: 'sql-db', sqlDb, logger, kvDb, mediaDb: mediaDbLocal })
  relationshipDb ??= RelationshipDb({ t: 'hash-map', mediaDb: mediaDbLocal })

  let creditDb: ICreditDb
  if (config.storage === 'hash-map') creditDb ??= CreditDb({ t: 'hash-map', personDb })
  if (config.storage === 'sql-db')
    creditDb ??= CreditDb({ t: 'sql-db', sqlDb, logger, kvDb, personDb })
  creditDb ??= CreditDb({ t: 'hash-map', personDb })

  let videoDb: IVideoDb
  if (config.storage === 'hash-map') videoDb ??= VideoDb({ t: 'hash-map' })
  if (config.storage === 'sql-db') videoDb ??= VideoDb({ t: 'sql-db', sqlDb, logger, kvDb })
  videoDb ??= VideoDb({ t: 'hash-map' })

  let feedDb: IFeedDb
  if (config.storage === 'hash-map') feedDb ??= FeedDb({ t: 'hash-map', logger })
  if (config.storage === 'sql-db')
    feedDb ??= FeedDb({ t: 'sql-db', sqlDb, logger, migrationPolicy })
  feedDb ??= FeedDb({ t: 'kv-db', kvDb, logger })

  const relatedDbs = { personDb, relationshipDb, creditDb, videoDb }
  const throttle = TimeSpan.minutes(30)
  const mediaDb = MediaDbFrontend({
    t: 'one-way-sync-remote-to-local',
    logger,
    kvDb,
    throttle,
    relatedDbs,
    mediaDbLocal,
    mediaDbRemote,
  })

  return {
    kvDb,
    mediaDb,
    isProd,
    sqlDb,
    logger,
    clientSessionId,
    feedDb,
    personDb,
    relationshipDb,
    creditDb,
    videoDb,
    pglite,
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
