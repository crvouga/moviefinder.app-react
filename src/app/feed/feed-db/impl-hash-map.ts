import { Db } from '~/@/db/impl/impl'
import { ILogger } from '~/@/logger'
import { IFeedDb } from './interface'

export type Config = {
  t: 'hash-map'
  logger: ILogger
}

export const FeedDb = (_config: Config): IFeedDb => {
  return Db({
    t: 'hash-map',
    toPrimaryKey: (entity) => entity.id,
    getRelated: async () => ({}),
    parser: IFeedDb.parser,
  })
}
