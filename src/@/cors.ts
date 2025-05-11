import { ILogger } from './logger'

export const allowCORS = (input: { req: Request; res: Response; logger: ILogger }) => {
  const origin = input.req.headers.get('origin')
  input.logger.info('Allowing CORS', { origin })
  input.res.headers.set('Access-Control-Allow-Origin', origin ?? '*')
  input.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  input.res.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-CSRF-Token, X-Requested-With'
  )
  input.res.headers.set('Access-Control-Allow-Credentials', 'true')
  input.res.headers.set('Access-Control-Max-Age', '86400')
}
