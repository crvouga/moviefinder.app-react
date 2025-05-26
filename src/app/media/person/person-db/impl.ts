import * as ImplBlinkDb from './impl-blink-db'
import * as ImplHashMap from './impl-hash-map'
import * as ImplSqlDb from './impl-sql-db'
import { IPersonDb } from './interface'

export type Config = ImplHashMap.Config | ImplSqlDb.Config | ImplBlinkDb.Config

export const PersonDb = (config: Config): IPersonDb => {
  switch (config.t) {
    case 'hash-map':
      return ImplHashMap.PersonDb(config)
    case 'sql-db':
      return ImplSqlDb.PersonDb(config)
    case 'blink-db':
      return ImplBlinkDb.PersonDb(config)
  }
}
