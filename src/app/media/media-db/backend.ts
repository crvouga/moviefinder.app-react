import { ImplTmdbClient } from './impl-tmdb-client'
import { IMediaDb } from './inter'

export type Config = ImplTmdbClient.Config

export const BackendMediaDb = (config: Config): IMediaDb => {
  switch (config.t) {
    case 'tmdb-client': {
      return ImplTmdbClient.MediaDb(config)
    }
  }
}
