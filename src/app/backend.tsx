import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { AppRouter } from './trpc/backend/app-router'
import { createContext } from './trpc/backend/context'
import { Ctx } from './ctx/backend'

export const App = (config: { ctx: Ctx }) => {
  return {
    async respond(request: Request): Promise<Response | null> {
      const response = await fetchRequestHandler({
        endpoint: '/trpc',
        req: request,
        router: AppRouter(config),
        createContext,
      })

      if (response.status === 404) return null

      return response
    },
  }
}
