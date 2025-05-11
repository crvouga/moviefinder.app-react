import { ZodSchema } from 'zod'
import { Err, Ok, Result } from '~/@/result'
import { objectToStringMap } from './object-to-string-map'
import { TmdbClientConfig } from './tmdb-client-config'
import { TMDB_BASE_URL } from './base-url'

export const HttpClientGet =
  <
    QueryParams extends Record<string, unknown>,
    ResponseBody extends Record<string, unknown>,
    PathParams = Record<string, unknown>,
  >(config: {
    config: TmdbClientConfig
    endpoint: (pathParams: PathParams) => string
    queryParams: ZodSchema<QueryParams>
    response: ZodSchema<ResponseBody>
  }) =>
  async (input: {
    pathParams: PathParams
    queryParams: QueryParams
  }): Promise<Result<ResponseBody, Error>> => {
    try {
      const url = new URL(
        `${config.config.baseUrl ?? TMDB_BASE_URL}${config.endpoint(input.pathParams)}`
      )
      const searchParams = new URLSearchParams(objectToStringMap(input.queryParams))
      const headers = new Headers()

      headers.set('Authorization', `Bearer ${config.config.readAccessToken}`)

      url.search = searchParams.toString()
      const urlString = url.toString()

      const fetched = await fetch(urlString, {
        headers,
      })

      const body = await fetched.json()

      const parsed = await config.response.safeParseAsync({ status: fetched.status, body })

      if (!parsed.success) {
        return Err(parsed.error)
      }

      return Ok(parsed.data)
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        return Err(error)
      }
      return Err(new Error('Failed to fetch data'))
    }
  }
