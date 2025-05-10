import { z } from 'zod'
import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'
//

export const TmdbPersonCombinedCreditsQueryParams = z.object({
  language: z
    .string()
    .min(2, 'language must have a minimum length of 2 characters')
    .regex(/^([a-z]{2})-([A-Z]{2})$/, 'language must follow the format "xx-XX" (ISO 639-1)')
    .default('en-US')
    .optional(),
})

const CastAndCrew = z.object({
  id: z.number().optional(),
  original_language: z.string().optional(),
  episode_count: z.number().optional(),
  overview: z.string().optional(),
  origin_country: z.array(z.string()).optional(),
  original_name: z.string().optional(),
  genre_ids: z.array(z.number()).optional(),
  name: z.string().optional(),
  media_type: z.string().optional(),
  poster_path: z.string().nullable().optional(),
  first_air_date: z.string().optional(),
  vote_average: z.number().optional(),
  vote_count: z.number().optional(),
  character: z.string().optional(),
  backdrop_path: z.string().nullable().optional(),
  popularity: z.number().optional(),
  credit_id: z.string().optional(),
  original_title: z.string().optional(),
  video: z.boolean().optional(),
  release_date: z.string().optional(),
  title: z.string().optional(),
  adult: z.boolean().optional(),
})

export const TmdbCombinedCreditsOkResponse = z.object({
  cast: z.array(CastAndCrew).optional(),
  crew: z.array(CastAndCrew).optional(),
})

const TmdbCombinedCreditsResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: TmdbCombinedCreditsOkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])

export type TmdbCombinedCreditsResponse = z.infer<typeof TmdbCombinedCreditsResponse>

export const CombinedCreditsClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ id }: { id: number }) => `/person/${id}/combined_credits`,
      queryParams: TmdbPersonCombinedCreditsQueryParams,
      response: TmdbCombinedCreditsResponse,
    }),
  }
}
