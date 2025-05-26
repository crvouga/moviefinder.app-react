import * as ImplBlinkDb from './impl-blink-db'
import * as ImplHashMap from './impl-hash-map'
import * as ImplSqlDb from './impl-sql-db'
import { IVideoDb } from './interface'

export type Config = ImplHashMap.Config | ImplSqlDb.Config | ImplBlinkDb.Config

export const VideoDb = (config: Config): IVideoDb => {
  switch (config.t) {
    case 'hash-map':
      return ImplHashMap.VideoDb(config)
    case 'sql-db':
      return ImplSqlDb.VideoDb(config)
    case 'blink-db':
      return ImplBlinkDb.VideoDb(config)
  }
}
