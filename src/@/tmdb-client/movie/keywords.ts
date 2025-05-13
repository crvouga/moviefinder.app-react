import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

export const TmdbMovieKeyword = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
})

export type TmdbMovieKeyword = z.infer<typeof TmdbMovieKeyword>

const OkResponse = z.object({
  id: z.number().optional(),
  keywords: z.array(TmdbMovieKeyword).optional(),
})

export type OkResponseType = z.infer<typeof OkResponse>

const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: OkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
type ApiResponse = z.infer<typeof ApiResponse>

export const MovieKeywordsClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ movie_id }: { movie_id: number }) => `/movie/${movie_id}/keywords`,
      response: ApiResponse,
      queryParams: z.object({}),
    }),
  }
}

MovieKeywordsClient.OkResponse = OkResponse
MovieKeywordsClient.TmdbMovieKeyword = TmdbMovieKeyword
