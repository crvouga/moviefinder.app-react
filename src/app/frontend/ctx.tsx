import { createContext, useContext } from 'react'
import { KvDb } from '~/@/kv-db/impl'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger, Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { IMigrationPolicy } from '~/@/migration-policy/interface'
import { PgliteInstance } from '~/@/pglite/pglite-instance'
import { PgliteWorkerInstance } from '~/@/pglite/pglite-worker-instance/pglite-worker-instance'
import { IPgliteInstance } from '~/@/pglite/types'
import { PubSub } from '~/@/pub-sub'
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
}

type Config =
  | {
      t: 'sql-db'
    }
  | {
      t: 'hash-map'
    }

const init = (): Ctx => {
  let config: Config
  config ??= { t: 'hash-map' }
  config ??= { t: 'sql-db' }

  const isProd = import.meta.env.VITE_NODE_ENV === 'production'

  let logger: ILogger
  logger ??= Logger.prefix('app', Logger({ t: 'console' }))
  logger ??= Logger({ t: 'noop' })

  let pglite: Promise<IPgliteInstance>
  pglite ??= PgliteWorkerInstance({ t: 'indexed-db', databaseName: 'db' })
  pglite ??= PgliteInstance({ t: 'indexed-db', databaseName: 'db' })
  pglite ??= PgliteInstance({ t: 'in-memory' })
  pglite ??= PgliteWorkerInstance({ t: 'in-memory' })

  const sqlDb = SqlDb({ t: 'pglite', pglite, logger })

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? ''

  const trpcClient = TrpcClient({ backendUrl })

  let migrationPolicy: IMigrationPolicy
  migrationPolicy = MigrationPolicy({ t: 'always-run', logger })

  let kvDb: IKvDb
  if (config.t === 'hash-map') kvDb ??= KvDb({ t: 'hash-map', map: new Map() })
  if (config.t === 'sql-db') kvDb ??= KvDb({ t: 'sql-db', sqlDb, migrationPolicy })
  kvDb ??= KvDb({ t: 'browser-storage', storage: localStorage })

  migrationPolicy = MigrationPolicy({ t: 'dangerously-wipe-on-new-schema', kvDb, logger })

  let kvCached: IKvDb
  if (config.t === 'sql-db')
    kvCached ??= KvDb({ t: 'cached', source: kvDb, cache: KvDb({ t: 'hash-map', map: new Map() }) })
  kvCached ??= kvDb

  const clientSessionIdStorage = ClientSessionIdStorage({ storage: localStorage })
  const clientSessionId = clientSessionIdStorage.get() ?? ClientSessionId.generate()
  clientSessionIdStorage.set(clientSessionId)

  let mediaDbLocal: IMediaDb
  if (config.t === 'hash-map') mediaDbLocal ??= MediaDbFrontend({ t: 'hash-map' })
  if (config.t === 'sql-db')
    mediaDbLocal ??= MediaDbFrontend({ t: 'sql-db', sqlDb, migrationPolicy })
  mediaDbLocal ??= MediaDbFrontend({ t: 'hash-map' })

  let personDb: IPersonDb
  if (config.t === 'hash-map') personDb ??= PersonDb({ t: 'hash-map' })
  if (config.t === 'sql-db') personDb ??= PersonDb({ t: 'sql-db', sqlDb, logger, kvDb })
  personDb ??= PersonDb({ t: 'hash-map' })

  let relationshipDb: IRelationshipDb
  if (config.t === 'hash-map')
    relationshipDb ??= RelationshipDb({ t: 'hash-map', mediaDb: mediaDbLocal })
  if (config.t === 'sql-db')
    relationshipDb ??= RelationshipDb({ t: 'sql-db', sqlDb, logger, kvDb, mediaDb: mediaDbLocal })
  relationshipDb ??= RelationshipDb({ t: 'hash-map', mediaDb: mediaDbLocal })

  let creditDb: ICreditDb
  if (config.t === 'hash-map') creditDb ??= CreditDb({ t: 'hash-map', personDb })
  if (config.t === 'sql-db') creditDb ??= CreditDb({ t: 'sql-db', sqlDb, logger, kvDb, personDb })
  creditDb ??= CreditDb({ t: 'hash-map', personDb })

  let videoDb: IVideoDb
  if (config.t === 'hash-map') videoDb ??= VideoDb({ t: 'hash-map' })
  if (config.t === 'sql-db') videoDb ??= VideoDb({ t: 'sql-db', sqlDb, logger, kvDb })
  videoDb ??= VideoDb({ t: 'hash-map' })

  const mediaDb = MediaDbFrontend({
    t: 'one-way-sync-remote-to-local',
    kvDb: kvCached,
    local: mediaDbLocal,
    remote: MediaDbFrontend({ t: 'trpc-client', trpcClient }),
    logger,
    pubSub: PubSub(),
    throttle: TimeSpan.seconds(30),
    relatedDbs: { personDb, relationshipDb, creditDb, videoDb },
  })

  let feedDb: IFeedDb
  if (config.t === 'hash-map') feedDb ??= FeedDb({ t: 'hash-map', logger })
  if (config.t === 'sql-db') feedDb ??= FeedDb({ t: 'sql-db', sqlDb, logger, migrationPolicy })
  feedDb ??= FeedDb({ t: 'kv-db', kvDb, logger })

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
