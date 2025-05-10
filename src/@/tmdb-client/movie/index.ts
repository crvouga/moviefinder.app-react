import { TmdbClientConfig } from '../@/tmdb-client-config'
import { MovieVideoClient } from './video'
import { MovieDetailsClient } from './details'

export const MovieClient = (config: TmdbClientConfig) => {
  return {
    video: MovieVideoClient(config),
    details: MovieDetailsClient(config),
  }
}
