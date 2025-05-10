//  https://www.themoviedb.org/settings/api
// example API request: https://api.themoviedb.org/3/movie/550?api_key=cf875963864a2cef08d67ed92cff7703

import { TMDB_BASE_URL } from './base-url'

export type TmdbClientConfig = {
  apiKey: string
  baseUrl?: string
}

const init = (input: { apiKey: string; baseUrl?: string }): TmdbClientConfig => {
  return {
    apiKey: input.apiKey,
    baseUrl: input.baseUrl ?? TMDB_BASE_URL,
  }
}

export const TmdbClientConfig = {
  init,
}
