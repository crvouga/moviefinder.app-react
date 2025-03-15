import frontend from '../frontend/frontend.html'
import { Logger } from '../@/logger'

const logger = Logger({
  t: 'console',
})

const server = Bun.serve({
  routes: {
    '/': frontend,
  },
  async fetch(req) {
    const url = new URL(req.url)
    url.pathname = '/'
    return Response.redirect(url.toString())
  },
})

logger.info(`Server is running on ${server.url}`)
