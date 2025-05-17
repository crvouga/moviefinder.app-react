import { Logger } from '~/@/logger'
import * as ImplHashMap from './impl-hash-map'
import * as ImplKvDb from './impl-kv-db'
import * as ImplSqlDb from './impl-sql-db'
import { IFeedDb } from './interface'

export type Config = ImplSqlDb.Config | ImplHashMap.Config | ImplKvDb.Config

export const FeedDb = (config: Config): IFeedDb => {
  const logger = Logger.prefix('feed-db', config.logger)
  switch (config.t) {
    case 'sql-db':
      return ImplSqlDb.FeedDb({ ...config, logger })
    case 'hash-map':
      return ImplHashMap.FeedDb({ ...config, logger })
    case 'kv-db':
      return ImplKvDb.FeedDb({ ...config, logger })
  }
}
