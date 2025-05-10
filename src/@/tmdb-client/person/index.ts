import { TmdbClientConfig } from '../@/tmdb-client-config'
import { CombinedCreditsClient } from './combined_credits'
import { PersonDetailsClient } from './details'

export const PersonClient = (config: TmdbClientConfig) => {
  return {
    details: PersonDetailsClient(config),
    combinedCredits: CombinedCreditsClient(config),
  }
}
