import frontend from '../frontend/frontend.html'
import { Logger } from '../@/logger'

const logger = Logger.prefix('app', Logger({ type: 'console' }))

const server = Bun.serve({
  routes: {
    '/': frontend,
  },
  async fetch(req) {
    const requestId = `request-id-${crypto.randomUUID()}`
    const requestLogger = Logger.prefix(requestId, logger)
    requestLogger.info('Request received', {
      url: req.url,
      method: req.method,
    })
    const url = new URL(req.url)
    url.pathname = '/'
    return Response.redirect(url.toString())
  },
})

logger.info(`Server is running on ${server.url}`)
