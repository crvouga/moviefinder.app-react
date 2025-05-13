import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

export const TmdbMovieSimilar = z.object({
  adult: z.boolean().optional(),
  backdrop_path: z.string().nullable().optional(),
  id: z.number().optional(),
  title: z.string().optional(),
  original_language: z.string().optional(),
  original_title: z.string().optional(),
  overview: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  media_type: z.string().optional(),
  genre_ids: z.array(z.number()).optional(),
  popularity: z.number().optional(),
  release_date: z.string().optional(),
  video: z.boolean().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
})

export type TmdbMovieSimilar = z.infer<typeof TmdbMovieSimilar>

const OkResponse = z.object({
  page: z.number().optional(),
  results: z.array(TmdbMovieSimilar).optional(),
  total_pages: z.number().optional(),
  total_results: z.number().optional(),
})

export type OkResponseType = z.infer<typeof OkResponse>

const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: OkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
type ApiResponse = z.infer<typeof ApiResponse>

export const MovieSimilarClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ movie_id }: { movie_id: number }) => `/movie/${movie_id}/similar`,
      response: ApiResponse,
      queryParams: z.object({
        language: z.string().optional(),
        page: z.number().optional(),
      }),
    }),
  }
}

MovieSimilarClient.OkResponse = OkResponse
MovieSimilarClient.TmdbMovieSimilar = TmdbMovieSimilar
