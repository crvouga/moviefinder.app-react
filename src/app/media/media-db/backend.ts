import { ImplTmdbClient } from './impl-tmdb-client'
import { IMediaDb } from './interface'

export type Config = ImplTmdbClient.Config

export const MediaDbBackend = (config: Config): IMediaDb => {
  switch (config.t) {
    case 'tmdb-client': {
      return ImplTmdbClient.MediaDb(config)
    }
  }
}
