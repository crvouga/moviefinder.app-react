import { TmdbClientConfig } from '../@/tmdb-client-config'
import { MovieSearchClient } from './movie'
import { MultiSearchClient } from './multi'

export const SearchClient = (config: TmdbClientConfig) => {
  return {
    multi: MultiSearchClient(config),
    movie: MovieSearchClient(config),
  }
}
