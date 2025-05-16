import { Ctx } from '~/app/backend/ctx'
import { publicProcedure } from '~/app/trpc/backend/trpc'
import { IMediaDb } from '../interface/interface'

export const MediaDbRouter = (config: { ctx: Ctx }) => {
  return {
    query: publicProcedure
      .input(IMediaDb.parser.QueryInput)
      .output(IMediaDb.parser.QueryOutput)
      .query(async ({ input }) => {
        return await config.ctx.mediaDb.query(input)
      }),
    upsert: publicProcedure
      .input(IMediaDb.parser.UpsertInput)
      .output(IMediaDb.parser.UpsertOutput)
      .mutation(async ({ input }) => {
        return await config.ctx.mediaDb.upsert(input)
      }),
  }
}
