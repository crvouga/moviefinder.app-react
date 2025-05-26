import { ImplBlinkDb } from '../impl-blink-db'
import { ImplHashMap } from '../impl-hash-map'
import { ImplOneWaySyncRemoteToLocal } from '../impl-one-way-sync-remote-to-local'
import { ImplSqlDb } from '../impl-sql-db'
import { ImplTrpcClient } from '../impl-trpc-client'
import { IMediaDb } from '../interface/interface'

export type Config =
  | ImplTrpcClient.Config
  | ImplSqlDb.Config
  | ImplOneWaySyncRemoteToLocal.Config
  | ImplHashMap.Config
  | ImplBlinkDb.Config

export const MediaDbFrontend = (config: Config): IMediaDb => {
  switch (config.t) {
    case 'trpc-client':
      return ImplTrpcClient.MediaDb(config)
    case 'sql-db':
      return ImplSqlDb.MediaDb(config)
    case 'one-way-sync-remote-to-local':
      return ImplOneWaySyncRemoteToLocal.MediaDb(config)
    case 'hash-map':
      return ImplHashMap.MediaDb(config)
    case 'blink-db':
      return ImplBlinkDb.MediaDb(config)
  }
}
