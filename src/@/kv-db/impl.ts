import { ImplBrowserStorage } from './impl-browser-storage'
import { ImplSqlDb } from './impl-sql-db'
import { IKvDb } from './interface'

export type Config = ImplBrowserStorage.Config | ImplSqlDb.Config

export const KvDb = (config: Config): IKvDb => {
  switch (config.t) {
    case 'browser-storage':
      return ImplBrowserStorage.KvDb(config)
    case 'db-conn':
      return ImplSqlDb.KvDb(config)
  }
}
