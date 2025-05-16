import { z } from 'zod'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'
import { TmdbConfiguration } from './configuration'

export const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: TmdbConfiguration.parser }),
])

export const ConfigurationClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: () => '/configuration',
      queryParams: z.object({}),
      response: ApiResponse,
    }),
  }
}
