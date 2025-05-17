import * as ImplBrowserStorage from './impl-browser-storage'
import * as ImplCached from './impl-cached'
import * as ImplHashMap from './impl-hash-map'
import * as ImplNamespaced from './impl-namespaced'
import * as ImplSqlDb from './impl-sql-db'
import { IKvDb } from './interface'

export type Config =
  | ImplBrowserStorage.Config
  | ImplSqlDb.Config
  | ImplNamespaced.Config
  | ImplCached.Config
  | ImplHashMap.Config

export const KvDb = (config: Config): IKvDb => {
  switch (config.t) {
    case 'browser-storage':
      return ImplBrowserStorage.KvDb(config)
    case 'sql-db':
      return ImplSqlDb.KvDb(config)
    case 'namespaced':
      return ImplNamespaced.KvDb(config)
    case 'cached':
      return ImplCached.KvDb(config)
    case 'hash-map':
      return ImplHashMap.KvDb(config)
  }
}
