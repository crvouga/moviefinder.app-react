import { TmdbClientConfig } from './@/tmdb-client-config'
import { ConfigurationClient } from './configuration'
import { DiscoverClient } from './discover'
import { MovieClient } from './movie'
import { PersonClient } from './person'
import { SearchClient } from './search'

export const TmdbClient = (config: TmdbClientConfig) => {
  return {
    search: SearchClient(config),
    discover: DiscoverClient(config),
    configuration: ConfigurationClient(config),
    movie: MovieClient(config),
    person: PersonClient(config),
  }
}

export type TmdbClient = ReturnType<typeof TmdbClient>
