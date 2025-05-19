import { ImplPglite } from './impl-pglite'
import { ISqlDb } from './interface'

export type Config = ImplPglite.Config

export const SqlDb = (config: Config): ISqlDb => {
  const logger = config.logger.prefix(['sql-db'])
  switch (config.t) {
    case 'pglite':
      return ImplPglite.SqlDb({ ...config, logger })
  }
}
