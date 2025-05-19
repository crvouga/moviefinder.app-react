import { Logger } from '../logger'
import { ImplPglite } from './impl-pglite'
import { ISqlDb } from './interface'

export type Config = ImplPglite.Config

export const SqlDb = (config: Config): ISqlDb => {
  const logger = Logger.prefix('sql-db', config.logger)
  switch (config.t) {
    case 'pglite':
      return ImplPglite.SqlDb({ ...config, logger })
  }
}
