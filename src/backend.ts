import { App } from '~/app/backend'
import { Ctx } from '~/app/ctx/backend'
import { allowCORS } from './@/cors'
import { ILogger, Logger } from './@/logger'
import { ServeSinglePageApp } from './@/serve-single-page-app'
import { RequestId } from './app/@/request-id'

const ctx = await Ctx.init()

const app = App({ ctx })

const respond = async (input: { req: Request; logger: ILogger }): Promise<Response> => {
  const res = await app.respond(input.req)

  if (res) return res

  return ServeSinglePageApp.respond({
    req: input.req,
    logger: input.logger,
    distDir: 'dist',
    indexHtml: 'index.html',
  })
}

const server = Bun.serve({
  async fetch(req) {
    const requestId = RequestId.generate()
    const logger = Logger.prefix(requestId, ctx.logger)
    logger.info('Request received', { url: req.url, method: req.method })

    if (req.method === 'OPTIONS') {
      const res = new Response(null, { status: 204 })
      allowCORS({ req, res, logger })
      return res
    }

    const res = await respond({ req, logger })
    allowCORS({ req, res, logger })
    return res
  },
})

ctx.logger.info(`server is running on ${server.url}`)

if (ctx.isProd) {
  ctx.logger.info('Running in production mode')
} else {
  ctx.logger.info('Running in development mode')
}
