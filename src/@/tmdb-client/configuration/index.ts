import { z } from 'zod'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

export const ImagesConfigurationSchema = z.object({
  base_url: z.string().optional(),
  secure_base_url: z.string().optional(),
  backdrop_sizes: z.array(z.string()).optional(),
  logo_sizes: z.array(z.string()).optional(),
  poster_sizes: z.array(z.string()).optional(),
  profile_sizes: z.array(z.string()).optional(),
  still_sizes: z.array(z.string()).optional(),
  change_keys: z.array(z.string()).optional(),
})

export const Configuration = z.object({
  images: ImagesConfigurationSchema.optional(),
  change_keys: z.array(z.string()).optional(),
})
export type Configuration = z.infer<typeof Configuration>

export const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: Configuration }),
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
