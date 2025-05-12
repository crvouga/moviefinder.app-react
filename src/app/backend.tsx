import { Ctx } from './backend/ctx'
import { TrpcServer } from './trpc/backend/trpc-server'

export const App = (config: { ctx: Ctx }) => {
  const trpcServer = TrpcServer({ ctx: config.ctx })

  return {
    async respond(request: Request): Promise<Response | null> {
      const response = await trpcServer.respond(request)

      return response
    },
  }
}
