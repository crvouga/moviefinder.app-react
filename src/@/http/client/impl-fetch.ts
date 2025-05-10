import { HttpReq } from '../req'
import { IHttpClient } from './inter'

export type Config = {
  t: 'fetch'
}

export const HttpClient = (_config: Config): IHttpClient => {
  return {
    async send(request: HttpReq) {
      const response = await fetch(request.url, {
        method: request.method,
        body: request.body,
        headers: request.headers,
      })
      return {
        status: response.status,
        body: await response.text(),
        headers: Object.fromEntries(response.headers.entries()),
      }
    },
  }
}
