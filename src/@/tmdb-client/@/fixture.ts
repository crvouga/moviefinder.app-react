import { TmdbClient } from '../tmdb-client'
import { TmdbApiKey } from './api-key'
import { TMDB_BASE_URL } from './base-url'

export const TmdbClientFixture = () => {
  const TMDB_API_READ_ACCESS_TOKEN = TmdbApiKey.parse(process.env.TMDB_API_READ_ACCESS_TOKEN)

  const tmdbClient = TmdbClient({
    readAccessToken: TMDB_API_READ_ACCESS_TOKEN,
    baseUrl: TMDB_BASE_URL,
  })

  return { tmdbClient }
}
