import * as ImplBlinkDb from './impl-blink-db'
import * as ImplHashMap from './impl-hash-map'
import * as ImplSqlDb from './impl-sql-db'
import { IRelationshipDb } from './interface'

export type Config = ImplHashMap.Config | ImplSqlDb.Config | ImplBlinkDb.Config

export const RelationshipDb = (config: Config): IRelationshipDb => {
  switch (config.t) {
    case 'hash-map':
      return ImplHashMap.RelationshipDb(config)
    case 'sql-db':
      return ImplSqlDb.RelationshipDb(config)
    case 'blink-db':
      return ImplBlinkDb.RelationshipDb(config)
  }
}
