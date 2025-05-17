import { Logger } from '~/@/logger'
import { ImplSqlDb } from './impl-sql-db'
import { IFeedDb } from './interface/interface'

export type Config = ImplSqlDb.Config

export const FeedDb = (config: Config): IFeedDb => {
  const logger = Logger.prefix('feed-db', config.logger)
  switch (config.t) {
    case 'db-conn':
      return ImplSqlDb.FeedDb({ ...config, logger })
  }
}
