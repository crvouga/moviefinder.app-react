import { z } from 'zod'
import { TmdbApiKey } from '../@/api-key'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { Language } from '../@/language'
import { Region } from '../@/region'
import { TmdbClientConfig } from '../@/tmdb-client-config'

// https://developers.themoviedb.org/3/search/multi-search

export const TmdbSearchMultiQueryParams = z.object({
  api_key: TmdbApiKey.optional(),
  language: Language.optional(),
  query: z.string().min(0).optional(),
  page: z.number().int().min(1).max(1000).default(1).optional(),
  include_adult: z.boolean().optional(),
  region: Region.optional(),
})

const MovieListResult = z.object({
  poster_path: z.string().nullable().optional(),
  adult: z.boolean().optional(),
  overview: z.string().optional(),
  release_date: z.string().optional(),
  original_title: z.string().optional(),
  genre_ids: z.array(z.number()).optional(),
  id: z.number().int().optional(),
  media_type: z.literal('movie').optional(),
  original_language: z.string().optional(),
  title: z.string().optional(),
  backdrop_path: z.string().nullable().optional(),
  popularity: z.number().optional(),
  vote_count: z.number().int().optional(),
  video: z.boolean().optional(),
  vote_average: z.number().optional(),
})

const TvListResult = z.object({
  poster_path: z.string().nullable().optional(),
  popularity: z.number().optional(),
  id: z.number().int().optional(),
  overview: z.string().optional(),
  backdrop_path: z.string().nullable().optional(),
  vote_average: z.number().optional(),
  media_type: z.literal('tv').optional(),
  first_air_date: z.string().optional(),
  origin_country: z.array(z.string()).optional(),
  genre_ids: z.array(z.number()).optional(),
  original_language: z.string().optional(),
  vote_count: z.number().int().optional(),
  name: z.string().optional(),
  original_name: z.string().optional(),
})

const PersonListResult = z.object({
  profile_path: z.string().nullable().optional(),
  adult: z.boolean().optional(),
  id: z.number().int().optional(),
  media_type: z.literal('person').optional(),
  known_for: z.array(z.union([MovieListResult, TvListResult])).optional(),
  name: z.string().optional(),
  popularity: z.number().optional(),
})

export const PersonKnownForResult = z.union([MovieListResult, TvListResult])

export const PersonListResultKnownFor = z
  .object({
    poster_path: z.string().nullable().optional(),
    adult: z.boolean().optional(),
    overview: z.string().optional(),
    release_date: z.string().optional(),
    original_title: z.string().optional(),
    genre_ids: z.array(z.number()).optional(),
    id: z.number().int().optional(),
    media_type: z.literal('movie').optional(),
    original_language: z.string().optional(),
    title: z.string().optional(),
    backdrop_path: z.string().nullable().optional(),
    popularity: z.number().optional(),
    vote_count: z.number().int().optional(),
    video: z.boolean().optional(),
    vote_average: z.number().optional(),
  })
  .or(TvListResult)

const OkResponse = z.object({
  page: z.number().int().optional(),
  results: z.array(z.union([MovieListResult, TvListResult, PersonListResult])).optional(),
  total_results: z.number().int().optional(),
  total_pages: z.number().int().optional(),
})

export type OkResponse = z.infer<typeof OkResponse>

export const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: OkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
export type ApiResponse = z.infer<typeof ApiResponse>

export const MultiSearchClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: () => '/search/multi',
      queryParams: TmdbSearchMultiQueryParams,
      response: ApiResponse,
    }),
  }
}
