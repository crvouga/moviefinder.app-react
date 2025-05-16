import { ImplBrowserStorage } from './impl-browser-storage'
import { ImplSqlDb } from './impl-db-conn'
import { IKeyValueDb } from './interface'

export type Config = ImplBrowserStorage.Config | ImplSqlDb.Config

export const KeyValueDb = (config: Config): IKeyValueDb => {
  switch (config.t) {
    case 'browser-storage':
      return ImplBrowserStorage.KeyValueDb(config)
    case 'db-conn':
      return ImplSqlDb.KeyValueDb(config)
  }
}
