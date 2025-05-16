import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

export const TmdbMovieCreditsQueryParams = z.object({
  language: z
    .string()
    .min(2)
    .regex(/([a-z]{2})-([A-Z]{2})/, 'Must follow the pattern ([a-z]{2})-([A-Z]{2})')
    .default('en-US'),
})

export type TmdbMovieCreditsQueryParams = z.infer<typeof TmdbMovieCreditsQueryParams>

export const TmdbMovieCast = z.object({
  adult: z.boolean().optional(),
  gender: z.number().optional(),
  id: z.number().optional(),
  known_for_department: z.string().optional(),
  name: z.string().optional(),
  original_name: z.string().optional(),
  popularity: z.number().optional(),
  profile_path: z.string().nullable().optional(),
  cast_id: z.number().optional(),
  character: z.string().optional(),
  credit_id: z.string().optional(),
  order: z.number().optional(),
})

export type TmdbMovieCast = z.infer<typeof TmdbMovieCast>

export const TmdbMovieCrew = z.object({
  adult: z.boolean().optional(),
  gender: z.number().optional(),
  id: z.number().optional(),
  known_for_department: z.string().optional(),
  name: z.string().optional(),
  original_name: z.string().optional(),
  popularity: z.number().optional(),
  profile_path: z.string().nullable().optional(),
  credit_id: z.string().optional(),
  department: z.string().optional(),
  job: z.string().optional(),
})

export type TmdbMovieCrew = z.infer<typeof TmdbMovieCrew>

const TmdbMovieCreditsOkResponse = z.object({
  id: z.number().optional(),
  cast: z.array(TmdbMovieCast).optional(),
  crew: z.array(TmdbMovieCrew).optional(),
})

export type TmdbMovieCreditsOkResponse = z.infer<typeof TmdbMovieCreditsOkResponse>

const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: TmdbMovieCreditsOkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
type ApiResponse = z.infer<typeof ApiResponse>

export const MovieCreditsClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ movie_id }: { movie_id: number }) => `/movie/${movie_id}/credits`,
      queryParams: TmdbMovieCreditsQueryParams,
      response: ApiResponse,
    }),
  }
}

MovieCreditsClient.OkResponse = TmdbMovieCreditsOkResponse
MovieCreditsClient.TmdbMovieCast = TmdbMovieCast
MovieCreditsClient.TmdbMovieCrew = TmdbMovieCrew
