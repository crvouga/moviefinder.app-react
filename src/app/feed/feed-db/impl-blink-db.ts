import { Database } from 'blinkdb'
import { Db } from '~/@/db/impl/impl'
import { ILogger } from '~/@/logger'
import { IFeedDb } from './interface'

export type Config = {
  t: 'blink-db'
  logger: ILogger
  blinkDb: Database
}

export const FeedDb = (config: Config): IFeedDb => {
  return Db({
    t: 'blink-db',
    db: config.blinkDb,
    tableName: 'feed',
    primaryKey: 'id',
    indexes: ['id', 'clientSessionId'],
    getRelated: async () => ({}),
    parser: IFeedDb.parser,
    logger: config.logger,
  })
}
