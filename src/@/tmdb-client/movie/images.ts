import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'

export const TmdbMovieImage = z.object({
  aspect_ratio: z.number().optional(),
  height: z.number().optional(),
  iso_639_1: z.string().nullable().optional(),
  file_path: z.string().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  width: z.number().optional(),
})

export type TmdbMovieImage = z.infer<typeof TmdbMovieImage>

const OkResponse = z.object({
  id: z.number().optional(),
  backdrops: z.array(TmdbMovieImage).optional(),
  logos: z.array(TmdbMovieImage).optional(),
  posters: z.array(TmdbMovieImage).optional(),
})

export type OkResponseType = z.infer<typeof OkResponse>

const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: OkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
type ApiResponse = z.infer<typeof ApiResponse>

export const MovieImagesClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ movie_id }: { movie_id: number }) => `/movie/${movie_id}/images`,
      response: ApiResponse,
      queryParams: z.object({
        include_image_language: z.string().optional(),
        language: z.string().optional(),
      }),
    }),
  }
}

MovieImagesClient.OkResponse = OkResponse
MovieImagesClient.TmdbMovieImage = TmdbMovieImage
