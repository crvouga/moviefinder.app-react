import { HttpReq } from '../req'
import { HttpRes } from '../res'

export type IHttpClient = {
  send: (request: HttpReq) => Promise<HttpRes>
}
