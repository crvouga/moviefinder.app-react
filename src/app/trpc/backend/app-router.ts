import { Ctx } from '~/app/backend/ctx'
import { MediaDbRouter } from '~/app/media/media-db/impl-trpc-client/backend'
import { router } from './trpc'

export const AppRouter = (config: { ctx: Ctx }) => {
  return router({
    mediaDb: MediaDbRouter(config),
  })
}

export type AppRouter = ReturnType<typeof AppRouter>
