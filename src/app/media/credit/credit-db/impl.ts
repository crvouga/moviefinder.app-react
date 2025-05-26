import * as ImplBlinkDb from './impl-blink-db'
import * as ImplHashMap from './impl-hash-map'
import * as ImplSqlDb from './impl-sql-db'
import { ICreditDb } from './interface'

export type Config = ImplHashMap.Config | ImplSqlDb.Config | ImplBlinkDb.Config

export const CreditDb = (config: Config): ICreditDb => {
  switch (config.t) {
    case 'hash-map':
      return ImplHashMap.CreditDb(config)
    case 'sql-db':
      return ImplSqlDb.CreditDb(config)
    case 'blink-db':
      return ImplBlinkDb.CreditDb(config)
  }
}
