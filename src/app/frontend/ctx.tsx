import { createContext, useContext } from 'react'
import { KvDb } from '~/@/kv-db/impl'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger, Logger } from '~/@/logger'
import { MigrationPolicy } from '~/@/migration-policy/impl'
import { createPglite } from '~/@/pglite/create-pglite'
import { PubSub } from '~/@/pub-sub'
import { SqlDb } from '~/@/sql-db/impl'
import { ISqlDb } from '~/@/sql-db/interface'
import { TimeSpan } from '~/@/time-span'
import { ClientSessionId } from '../@/client-session-id/client-session-id'
import { ClientSessionIdStorage } from '../@/client-session-id/client-session-id-storage'
import { FeedDb } from '../feed/feed-db/impl'
import { IFeedDb } from '../feed/feed-db/interface/interface'
import { CreditDb } from '../media/credit/credit-db/impl-sql-db'
import { ICreditDb } from '../media/credit/credit-db/interface'
import { MediaDbFrontend } from '../media/media-db/impl/frontend'
import { IMediaDb } from '../media/media-db/interface/interface'
import { PersonDb } from '../media/person/person-db/impl-sql-db'
import { IPersonDb } from '../media/person/person-db/interface'
import { RelationshipDb } from '../media/relationship/relationship-db/impl-sql-db'
import { IRelationshipDb } from '../media/relationship/relationship-db/interface'
import { VideoDb } from '../media/video/video-db/impl-sql-db'
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

  const logger = Logger.prefix('app', Logger({ t: 'console' }))

  const pglite = createPglite({ t: 'indexed-db', databaseName: 'db' })

  const sqlDb = SqlDb({ t: 'pglite', pglite, logger })

  const backendUrl = import.meta.env.VITE_BACKEND_URL ?? ''

  const trpcClient = TrpcClient({ backendUrl })

  const kvDb = KvDb({
    t: 'db-conn',
    sqlDb,
    migrationPolicy: MigrationPolicy({ t: 'always-run', logger }),
  })

  const clientSessionIdStorage = ClientSessionIdStorage({ storage: localStorage })
  const clientSessionId = clientSessionIdStorage.get() ?? ClientSessionId.generate()
  clientSessionIdStorage.set(clientSessionId)

  const mediaDb = MediaDbFrontend({
    t: 'one-way-sync-remote-to-local',
    local: MediaDbFrontend({
      t: 'db-conn',
      sqlDb,
      migrationPolicy: MigrationPolicy({ t: 'dangerously-wipe-on-new-schema', kvDb, logger }),
    }),
    remote: MediaDbFrontend({ t: 'trpc-client', trpcClient }),
    logger,
    pubSub: PubSub(),
    throttle: TimeSpan.seconds(10),
  })

  const feedDb = FeedDb({
    t: 'db-conn',
    sqlDb,
    logger,
    migrationPolicy: MigrationPolicy({
      t: 'dangerously-wipe-on-new-schema',
      kvDb,
      logger,
    }),
  })

  const personDb = PersonDb({
    t: 'sql-db',
    sqlDb,
    logger,
    kvDb,
  })

  const relationshipDb = RelationshipDb({
    t: 'sql-db',
    sqlDb,
    logger,
    kvDb,
  })

  const creditDb = CreditDb({
    t: 'sql-db',
    sqlDb,
    logger,
    kvDb,
  })

  const videoDb = VideoDb({
    t: 'sql-db',
    sqlDb,
    logger,
    kvDb,
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
