import { ImplDbConn } from '../impl-db-conn'
import { ImplOneWaySyncRemoteToLocal } from '../impl-one-way-sync-remote-to-local'
import { ImplTrpcClient } from '../impl-trpc-client'
import { IMediaDb } from '../interface/interface'

export type Config = ImplTrpcClient.Config | ImplDbConn.Config | ImplOneWaySyncRemoteToLocal.Config

export const MediaDbFrontend = (config: Config): IMediaDb => {
  switch (config.t) {
    case 'trpc-client':
      return ImplTrpcClient.MediaDb(config)
    case 'db-conn':
      return ImplDbConn.MediaDb(config)
    case 'one-way-sync-remote-to-local':
      return ImplOneWaySyncRemoteToLocal.MediaDb(config)
  }
}
