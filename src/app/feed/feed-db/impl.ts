import { Logger } from '~/@/logger'
import { ImplDbConn } from './impl-db-conn'
import { IFeedDb } from './interface'

export type Config = ImplDbConn.Config

export const FeedDb = (config: Config): IFeedDb => {
  const logger = Logger.prefix('feed-db', config.logger)
  switch (config.t) {
    case 'db-conn':
      return ImplDbConn.FeedDb({ ...config, logger })
  }
}
