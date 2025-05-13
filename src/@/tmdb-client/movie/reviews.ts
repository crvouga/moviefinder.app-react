import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

export const TmdbMovieReview = z.object({
  author: z.string().optional(),
  author_details: z
    .object({
      name: z.string().optional(),
      username: z.string().optional(),
      avatar_path: z.string().nullable().optional(),
      rating: z.number().nullable().optional(),
    })
    .optional(),
  content: z.string().optional(),
  created_at: z.string().optional(),
  id: z.string().optional(),
  updated_at: z.string().optional(),
  url: z.string().optional(),
})

export type TmdbMovieReview = z.infer<typeof TmdbMovieReview>

const OkResponse = z.object({
  id: z.number().optional(),
  page: z.number().optional(),
  results: z.array(TmdbMovieReview).optional(),
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

export const MovieReviewsClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ movie_id }: { movie_id: number }) => `/movie/${movie_id}/reviews`,
      response: ApiResponse,
      queryParams: z.object({
        language: z.string().optional(),
        page: z.number().optional(),
      }),
    }),
  }
}

MovieReviewsClient.OkResponse = OkResponse
MovieReviewsClient.TmdbMovieReview = TmdbMovieReview
