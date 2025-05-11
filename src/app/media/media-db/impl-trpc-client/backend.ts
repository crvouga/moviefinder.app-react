import { Ctx } from '~/app/ctx/backend'
import { publicProcedure } from '~/app/trpc/backend/trpc'
import { MediaDbQueryInput } from '../interface/query-input'
import { MediaDbQueryOutput } from '../interface/query-output'

export const MediaDbRouter = (config: { ctx: Ctx }) => {
  return {
    query: publicProcedure
      .input(MediaDbQueryInput.parser)
      .output(MediaDbQueryOutput.parser)
      .query(async ({ input }) => {
        return await config.ctx.mediaDb.query(input)
      }),
  }
}
