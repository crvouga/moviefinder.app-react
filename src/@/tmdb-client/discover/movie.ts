import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

// https://developers.themoviedb.org/3/discover/movie-discover

export const TmdbDiscoverMovieSortBy = z
  .enum([
    '',
    'popularity.asc',
    'popularity.desc',
    'release_date.asc',
    'release_date.desc',
    'revenue.asc',
    'revenue.desc',
    'primary_release_date.asc',
    'primary_release_date.desc',
    'original_title.asc',
    'original_title.desc',
    'vote_average.asc',
    'vote_average.desc',
    'vote_count.asc',
    'vote_count.desc',
  ])
  .default('popularity.desc')
  .optional()

export type TmdbDiscoverMovieSortBy = z.infer<typeof TmdbDiscoverMovieSortBy>

export const TmdbDiscoverMovieQueryParams = z.object({
  //   api_key: z.string().nonempty(),
  language: z
    .string()
    .regex(/^[a-z]{2}-[A-Z]{2}$/)
    .default('en-US')
    .optional(),
  region: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .optional(),
  sort_by: TmdbDiscoverMovieSortBy,
  certification_country: z.string().optional(),
  certification: z.string().optional(),
  'certification.lte': z.string().optional(),
  'certification.gte': z.string().optional(),
  include_adult: z.boolean().optional(),
  include_video: z.boolean().optional(),
  page: z.number().int().min(1).max(1000).default(1).optional(),
  primary_release_year: z.number().int().optional(),
  'primary_release_date.gte': z
    .string()
    .regex(/^(\d{4})-(\d{2})-(\d{2})$/)
    .optional(),
  'primary_release_date.lte': z
    .string()
    .regex(/^(\d{4})-(\d{2})-(\d{2})$/)
    .optional(),
  'release_date.gte': z
    .string()
    .regex(/^(\d{4})-(\d{2})-(\d{2})$/)
    .optional(),
  'release_date.lte': z
    .string()
    .regex(/^(\d{4})-(\d{2})-(\d{2})$/)
    .optional(),
  with_release_type: z.number().int().min(1).max(6).optional(),
  year: z.number().int().optional(),
  'vote_count.gte': z.number().int().min(0).optional(),
  'vote_count.lte': z.number().int().min(1).optional(),
  'vote_average.gte': z.number().min(0).optional(),
  'vote_average.lte': z.number().min(0).optional(),
  with_cast: z.string().optional(),
  with_crew: z.string().optional(),
  with_people: z.string().optional(),
  with_companies: z.string().optional(),
  with_genres: z.string().optional(),
  without_genres: z.string().optional(),
  with_keywords: z.string().optional(),
  without_keywords: z.string().optional(),
  'with_runtime.gte': z.number().int().optional(),
  'with_runtime.lte': z.number().int().optional(),
  with_original_language: z.string().optional(),
  with_watch_providers: z.string().optional(),
  watch_region: z.string().optional(),
  with_watch_monetization_types: z.enum(['flatrate', 'free', 'ads', 'rent', 'buy']).optional(),
  without_companies: z.string().optional(),
})

export type QueryParams = z.infer<typeof TmdbDiscoverMovieQueryParams>

export const MovieListResult = z.object({
  poster_path: z.string().nullable(),
  adult: z.boolean(),
  overview: z.string(),
  release_date: z.string().optional(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_title: z.string(),
  original_language: z.string(),
  title: z.string(),
  backdrop_path: z.string().nullable(),
  popularity: z.number(),
  vote_count: z.number(),
  video: z.boolean(),
  vote_average: z.number(),
})

export const OkResponse = z.object({
  page: z.number().optional(),
  results: z.array(MovieListResult),
  total_results: z.number().optional(),
  total_pages: z.number().optional(),
})

export const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: OkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
export type ApiResponse = z.infer<typeof ApiResponse>

export const MovieDiscoverClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: () => '/discover/movie',
      queryParams: TmdbDiscoverMovieQueryParams,
      response: ApiResponse,
    }),
  }
}
