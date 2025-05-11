//  https://www.themoviedb.org/settings/api
// example API request: https://api.themoviedb.org/3/movie/550?api_key=cf875963864a2cef08d67ed92cff7703

import { TMDB_BASE_URL } from './base-url'

export type TmdbClientConfig = {
  readAccessToken: string
  baseUrl?: string
}

const init = (input: Partial<TmdbClientConfig>): TmdbClientConfig => {
  return {
    readAccessToken: input.readAccessToken ?? '',
    baseUrl: input.baseUrl ?? TMDB_BASE_URL,
  }
}

export const TmdbClientConfig = {
  init,
}
