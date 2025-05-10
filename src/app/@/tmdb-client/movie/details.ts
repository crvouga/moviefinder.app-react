import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

const TmdbMovieDetailsQueryParams = z.object({
  language: z
    .string()
    .min(2)
    .regex(/([a-z]{2})-([A-Z]{2})/, { message: 'Invalid language format' })
    .default('en-US')
    .optional(),
  append_to_response: z
    .string()
    .regex(/([\w]+)/, { message: 'Invalid append_to_response format' })
    .optional(),
})

export type TmdbMovieDetailsQueryParamsType = z.infer<typeof TmdbMovieDetailsQueryParams>

export const TmdbMovieDetailsOkResponse = z.object({
  adult: z.boolean().optional(),
  backdrop_path: z.string().nullable().optional(),
  belongs_to_collection: z.nullable(z.object({})).optional(),
  budget: z.number().int().optional(),
  genres: z
    .array(
      z.object({
        id: z.number().int().optional(),
        name: z.string().optional(),
      })
    )
    .optional(),
  id: z.number().int().optional(),
  homepage: z.string().nullable().optional(),
  imdb_id: z.string().nullable().optional(),
  original_language: z.string().optional(),
  original_title: z.string().optional(),
  overview: z.string().nullable().optional(),
  popularity: z.number().optional(),
  poster_path: z.string().nullable().optional(),
  production_companies: z
    .array(
      z.object({
        name: z.string().optional(),
        id: z.number().int().optional(),
        logo_path: z.string().nullable().optional(),
        origin_country: z.string().optional(),
      })
    )
    .optional(),
  production_countries: z
    .array(
      z.object({
        iso_3166_1: z.string().optional(),
        name: z.string().optional(),
      })
    )
    .optional(),
  release_date: z.string().optional(),
  revenue: z.number().int().optional(),
  runtime: z.number().int().nullable().optional(),
  spoken_languages: z
    .array(
      z.object({
        iso_639_1: z.string().optional(),
        name: z.string().optional(),
      })
    )
    .optional(),
  status: z
    .enum(['Rumored', 'Planned', 'In Production', 'Post Production', 'Released', 'Canceled'])
    .optional(),
  tagline: z.string().nullable().optional(),
  title: z.string().optional(),
  video: z.boolean().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().int().optional(),
})

export type TmdbMovieDetailsOkResponse = z.infer<typeof TmdbMovieDetailsOkResponse>

const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: TmdbMovieDetailsOkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
type ApiResponse = z.infer<typeof ApiResponse>

export const MovieDetailsClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ id }: { id: number }) => `/movie/${id}`,
      queryParams: TmdbMovieDetailsQueryParams,
      response: ApiResponse,
    }),
  }
}
