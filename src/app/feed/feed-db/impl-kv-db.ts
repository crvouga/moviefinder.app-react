import { createDbFromKvDb } from '~/@/db/impl/create-db-from-kv-db'
import { IKvDb } from '~/@/kv-db/interface'
import { ILogger } from '~/@/logger'
import { IFeedDb } from './interface'

export type Config = {
  t: 'kv-db'
  logger: ILogger
  kvDb: IKvDb
}

export const FeedDb = (config: Config): IFeedDb => {
  return createDbFromKvDb({
    kvDb: config.kvDb,
    namespace: ['feed'],
    toPrimaryKey: (entity) => entity.id,
    getRelated: async () => ({}),
    parser: IFeedDb.parser,
  })
}
