import { ImplDbConn } from '../impl-db-conn'
import { ImplSyncReads } from '../impl-sync-reads'
import { ImplTmdbClient } from '../impl-tmdb-client'
import { IMediaDb } from '../interface/interface'

export type Config = ImplTmdbClient.Config | ImplDbConn.Config | ImplSyncReads.Config

export const MediaDbBackend = (config: Config): IMediaDb => {
  switch (config.t) {
    case 'tmdb-client': {
      return ImplTmdbClient.MediaDb(config)
    }
    case 'db-conn': {
      return ImplDbConn.MediaDb(config)
    }
    case 'sync-reads': {
      return ImplSyncReads.MediaDb(config)
    }
  }
}
