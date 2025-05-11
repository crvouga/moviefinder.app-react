import { ImplDbConn } from '../impl-db-conn'
import { ImplSyncReads } from '../impl-sync-reads'
import { ImplTrpcClient } from '../impl-trpc-client'
import { IMediaDb } from '../interface/interface'

export type Config = ImplTrpcClient.Config | ImplDbConn.Config | ImplSyncReads.Config

export const MediaDbFrontend = (config: Config): IMediaDb => {
  switch (config.t) {
    case 'trpc-client':
      return ImplTrpcClient.MediaDb(config)
    case 'db-conn':
      return ImplDbConn.MediaDb(config)
    case 'sync-reads':
      return ImplSyncReads.MediaDb(config)
  }
}
