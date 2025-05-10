import { App } from '~/app/backend'
import { Ctx } from '~/app/ctx/backend'
import { Logger } from './@/logger'
import frontend from './frontend.html'

const ctx = Ctx.init()

const app = App({ ctx })

const server = Bun.serve({
  routes: {
    '/': frontend,
  },
  async fetch(req) {
    const requestId = `request-id-${crypto.randomUUID()}`

    const requestLogger = Logger.prefix(requestId, ctx.logger)

    requestLogger.info('Request received', {
      url: req.url,
      method: req.method,
    })

    const url = new URL(req.url)
    url.pathname = '/'

    const response = await app.respond(req)

    if (response) return response

    return Response.redirect(url.toString())
  },
})

ctx.logger.info(`Server is running on ${server.url}`)
