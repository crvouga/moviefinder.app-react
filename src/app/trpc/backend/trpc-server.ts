import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { Ctx } from '~/app/backend/ctx'
import { ENDPOINT } from '../@/shared'
import { AppRouter } from './app-router'
import { createContext } from './context'

export const TrpcServer = (config: { ctx: Ctx }) => {
  return {
    async respond(request: Request): Promise<Response | null> {
      const response = await fetchRequestHandler({
        endpoint: ENDPOINT,
        req: request,
        router: AppRouter(config),
        createContext,
      })

      if (response.status === 404) return null

      return response
    },
  }
}
