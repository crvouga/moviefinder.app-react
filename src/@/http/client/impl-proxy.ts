import { ILogger } from '~/@/logger'
import { HttpReq } from '../req'
import { HttpRes } from '../res'
import { IHttpClient } from './inter'

export type Config = {
  t: 'proxy'
  proxyBaseUrl?: string
  proxyEndpoint: string
  logger: ILogger
}

export const HttpClient = (config: Config): IHttpClient => {
  return {
    async send(httpReq: HttpReq) {
      const response = await fetch(config.proxyBaseUrl + config.proxyEndpoint, {
        method: 'POST',
        body: JSON.stringify(httpReq),
        headers: httpReq.headers,
      })
      const httpRes: HttpRes = {
        status: response.status,
        body: await response.text(),
        headers: Object.fromEntries(response.headers.entries()),
      }
      return httpRes
    },
  }
}

export const ProxyHttpServer = (config: Config) => {
  return {
    async respond(request: Request): Promise<Response | null> {
      if (request.method !== 'POST') {
        return null
      }
      if (request.url !== config.proxyBaseUrl + config.proxyEndpoint) {
        return null
      }
      const httpReq = HttpReq.parser.parse(await request.json())
      const response = await fetch(httpReq.url, {
        method: httpReq.method,
        body: httpReq.body,
        headers: httpReq.headers,
      })
      const httpRes: HttpRes = {
        status: response.status,
        body: await response.text(),
        headers: Object.fromEntries(response.headers.entries()),
      }
      return new Response(httpRes.body, {
        status: httpRes.status,
        headers: httpRes.headers,
      })
    },
  }
}
