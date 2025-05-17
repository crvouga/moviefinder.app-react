import { ImplSqlDb } from '../impl-sql-db'
import { ImplOneWaySyncRemoteToLocal } from '../impl-one-way-sync-remote-to-local'
import { ImplTmdbClient } from '../impl-tmdb-client'
import { IMediaDb } from '../interface/interface'

export type Config = ImplTmdbClient.Config | ImplSqlDb.Config | ImplOneWaySyncRemoteToLocal.Config

export const MediaDbBackend = (config: Config): IMediaDb => {
  switch (config.t) {
    case 'tmdb-client': {
      return ImplTmdbClient.MediaDb(config)
    }
    case 'db-conn': {
      return ImplSqlDb.MediaDb(config)
    }
    case 'one-way-sync-remote-to-local': {
      return ImplOneWaySyncRemoteToLocal.MediaDb(config)
    }
  }
}
