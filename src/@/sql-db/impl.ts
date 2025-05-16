import { ImplPglite } from './impl-pglite'
import { IDbConn } from './interface'

export type Config = ImplPglite.Config

export const DbConn = (config: Config): IDbConn => {
  switch (config.t) {
    case 'pglite':
      return ImplPglite.DbConn(config)
  }
}
