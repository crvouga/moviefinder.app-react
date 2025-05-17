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

const init = (): Ctx => {
  const isProd = import.meta.env.VITE_NODE_ENV === 'production'

  let logger: ILogger
  logger ??= Logger.prefix('app', Logger({ t: 'console' }))
  logger ??= Logger({ t: 'noop' })

  let pglite: Promise<IPgliteInstance>
  pglite ??= PgliteInstance({ t: 'indexed-db', databaseName: 'db' })
  pglite ??= PgliteInstance({ t: 'in-memory' })
  pglite ??= PgliteWorkerInstance({ t: 'indexed-db', databaseName: 'db' })
  pglite ??= PgliteWorkerInstance({ t: 'in-memory' })

  const sqlDb = SqlDb({ t: 'pglite', pglite, logger })

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? ''

  const trpcClient = TrpcClient({ backendUrl })

  let migrationPolicy: IMigrationPolicy
  migrationPolicy = MigrationPolicy({ t: 'always-run', logger })

  let kvDb: IKvDb
  kvDb ??= KvDb({ t: 'browser-storage', storage: localStorage })
  kvDb ??= KvDb({ t: 'sql-db', sqlDb, migrationPolicy })

  migrationPolicy = MigrationPolicy({ t: 'dangerously-wipe-on-new-schema', kvDb, logger })

  const clientSessionIdStorage = ClientSessionIdStorage({ storage: localStorage })
  const clientSessionId = clientSessionIdStorage.get() ?? ClientSessionId.generate()
  clientSessionIdStorage.set(clientSessionId)

  let mediaDbLocal: IMediaDb
  mediaDbLocal ??= MediaDbFrontend({ t: 'hash-map' })
  mediaDbLocal ??= MediaDbFrontend({ t: 'sql-db', sqlDb, migrationPolicy })

  let personDb: IPersonDb
  personDb ??= PersonDb({ t: 'hash-map' })
  personDb ??= PersonDb({ t: 'sql-db', sqlDb, logger, kvDb })

  let relationshipDb: IRelationshipDb
  relationshipDb ??= RelationshipDb({ t: 'hash-map', mediaDb: mediaDbLocal })
  relationshipDb ??= RelationshipDb({ t: 'sql-db', sqlDb, logger, kvDb, mediaDb: mediaDbLocal })

  let creditDb: ICreditDb
  creditDb ??= CreditDb({ t: 'hash-map', personDb })
  creditDb ??= CreditDb({ t: 'sql-db', sqlDb, logger, kvDb, personDb })

  let videoDb: IVideoDb
  videoDb ??= VideoDb({ t: 'hash-map' })
  videoDb ??= VideoDb({ t: 'sql-db', sqlDb, logger, kvDb })

  const mediaDb = MediaDbFrontend({
    t: 'one-way-sync-remote-to-local',
    local: mediaDbLocal,
    remote: MediaDbFrontend({ t: 'trpc-client', trpcClient }),
    logger,
    pubSub: PubSub(),
    throttle: TimeSpan.seconds(10),
    relatedDbs: { personDb, relationshipDb, creditDb, videoDb },
  })

  let feedDb: IFeedDb
  feedDb ??= FeedDb({ t: 'kv-db', kvDb, logger })
  feedDb ??= FeedDb({ t: 'hash-map', logger })
  feedDb ??= FeedDb({ t: 'sql-db', sqlDb, logger, migrationPolicy })

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
