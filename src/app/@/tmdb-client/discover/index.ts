import { TmdbClientConfig } from '../@/tmdb-client-config'
import { MovieDiscoverClient } from './movie'

export const DiscoverClient = (config: TmdbClientConfig) => {
  return {
    movie: MovieDiscoverClient(config),
  }
}
