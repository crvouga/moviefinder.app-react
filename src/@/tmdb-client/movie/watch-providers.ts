import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

export const TmdbMovieWatchProvider = z.object({
  logo_path: z.string().nullable().optional(),
  provider_id: z.number().optional(),
  provider_name: z.string().optional(),
  display_priority: z.number().optional(),
})

export type TmdbMovieWatchProvider = z.infer<typeof TmdbMovieWatchProvider>

const WatchProviderCountry = z.object({
  link: z.string().optional(),
  rent: z.array(TmdbMovieWatchProvider).optional(),
  buy: z.array(TmdbMovieWatchProvider).optional(),
  flatrate: z.array(TmdbMovieWatchProvider).optional(),
  free: z.array(TmdbMovieWatchProvider).optional(),
})

const OkResponse = z.object({
  id: z.number().optional(),
  results: z.record(WatchProviderCountry).optional(),
})

export type OkResponseType = z.infer<typeof OkResponse>

const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: OkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
type ApiResponse = z.infer<typeof ApiResponse>

export const MovieWatchProvidersClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ movie_id }: { movie_id: number }) => `/movie/${movie_id}/watch/providers`,
      response: ApiResponse,
      queryParams: z.object({}),
    }),
  }
}

MovieWatchProvidersClient.OkResponse = OkResponse
MovieWatchProvidersClient.TmdbMovieWatchProvider = TmdbMovieWatchProvider
