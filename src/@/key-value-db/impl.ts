import { ImplBrowserStorage } from './impl-browser-storage'
import { ImplDbConn } from './impl-db-conn'
import { IKeyValueDb } from './interface'

export type Config = ImplBrowserStorage.Config | ImplDbConn.Config

export const KeyValueDb = (config: Config): IKeyValueDb => {
  switch (config.t) {
    case 'browser-storage':
      return ImplBrowserStorage.KeyValueDb(config)
    case 'db-conn':
      return ImplDbConn.KeyValueDb(config)
  }
}
