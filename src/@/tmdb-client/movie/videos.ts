import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

export const TmdbMovieVideoQueryParams = z.object({
  //   api_key: z.string()
  language: z
    .string()
    .min(2)
    .regex(/([a-z]{2})-([A-Z]{2})/, 'Must follow the pattern ([a-z]{2})-([A-Z]{2})')
    .default('en-US'),
})

export type TmdbMovieVideoQueryParams = z.infer<typeof TmdbMovieVideoQueryParams>

export const TmdbMovieVideo = z.object({
  id: z.string().optional(),
  iso_639_1: z.string().optional(),
  iso_3166_1: z.string().optional(),
  name: z.string().optional(),
  key: z.string().optional(),
  site: z.string().optional(),
  size: z.number().optional(),
  type: z.string().optional(),
  official: z.boolean().optional(),
  published_at: z.string().optional(),
})

export type TmdbMovieVideo = z.infer<typeof TmdbMovieVideo>

const OkResponse = z.object({
  id: z.number().optional(),
  results: z.array(TmdbMovieVideo).optional(),
})

export type OkResponseType = z.infer<typeof OkResponse>

const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: OkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
type ApiResponse = z.infer<typeof ApiResponse>

export const MovieVideosClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ movie_id }: { movie_id: number }) => `/movie/${movie_id}/videos`,
      queryParams: TmdbMovieVideoQueryParams,
      response: ApiResponse,
    }),
  }
}

MovieVideosClient.OkResponse = OkResponse
MovieVideosClient.TmdbMovieVideo = TmdbMovieVideo
