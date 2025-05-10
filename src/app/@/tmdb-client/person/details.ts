import { z } from 'zod'

import { ErrResponse } from '../@/error-response'
import { HttpClientGet } from '../@/http-client-get'
import { TmdbClientConfig } from '../@/tmdb-client-config'
import { TmdbCombinedCreditsOkResponse } from './combined_credits'

// https://developers.themoviedb.org/3/people/get-person-details

export const TmdbPersonDetailsQueryParams = z.object({
  language: z
    .string()
    .min(2)
    .regex(/([a-z]{2})-([A-Z]{2})/)
    .default('en-US')
    .optional(),
  append_to_response: z.string().optional(),
})

const OkResponse = z.object({
  birthday: z.string().nullable().optional(),
  known_for_department: z.string().optional(),
  deathday: z.string().nullable().optional(),
  id: z.number().int().optional(),
  name: z.string().optional(),
  also_known_as: z.array(z.string()).optional(),
  gender: z.number().int().min(0).max(3).optional(),
  biography: z.string().optional(),
  popularity: z.number().optional(),
  place_of_birth: z.string().nullable().optional(),
  profile_path: z.string().nullable().optional(),
  adult: z.boolean().optional(),
  imdb_id: z.string().optional(),
  homepage: z.string().nullable().optional(),
  combined_credits: TmdbCombinedCreditsOkResponse.optional(),
})

const ApiResponse = z.discriminatedUnion('status', [
  z.object({ status: z.literal(200), body: OkResponse }),
  z.object({ status: z.literal(401), body: ErrResponse }),
  z.object({ status: z.literal(404), body: ErrResponse }),
])
type ApiResponse = z.infer<typeof ApiResponse>

export const PersonDetailsClient = (config: TmdbClientConfig) => {
  return {
    get: HttpClientGet({
      config,
      endpoint: ({ id }: { id: number }) => `/person/${id}`,
      queryParams: TmdbPersonDetailsQueryParams,
      response: ApiResponse,
    }),
  }
}
