import { createDbFromHashMap } from '~/@/db/impl/create-db-from-hash-map'
import { ILogger } from '~/@/logger'
import { IFeedDb } from './interface'

export type Config = {
  t: 'hash-map'
  logger: ILogger
}

export const FeedDb = (_config: Config): IFeedDb => {
  return createDbFromHashMap({
    entities: new Map(),
    indexes: new Map(),
    toPrimaryKey: (entity) => entity.id,
    getRelated: async () => ({}),
    parser: IFeedDb.parser,
  })
}
