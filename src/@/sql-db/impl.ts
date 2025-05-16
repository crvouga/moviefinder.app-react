import { ImplPglite } from './impl-pglite'
import { ISqlDb } from './interface'

export type Config = ImplPglite.Config

export const SqlDb = (config: Config): ISqlDb => {
  switch (config.t) {
    case 'pglite':
      return ImplPglite.SqlDb(config)
  }
}
