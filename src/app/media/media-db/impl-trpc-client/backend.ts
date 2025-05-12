import { Ctx } from '~/app/backend/ctx'
import { publicProcedure } from '~/app/trpc/backend/trpc'
import { MediaDbQueryInput } from '../interface/query-input'
import { MediaDbQueryOutput } from '../interface/query-output'
import { MediaDbUpsertInput } from '../interface/upsert-input'
import { MediaDbUpsertOutput } from '../interface/upsert-output'

export const MediaDbRouter = (config: { ctx: Ctx }) => {
  return {
    query: publicProcedure
      .input(MediaDbQueryInput.parser)
      .output(MediaDbQueryOutput.parser)
      .query(async ({ input }) => {
        return await config.ctx.mediaDb.query(input)
      }),
    upsert: publicProcedure
      .input(MediaDbUpsertInput.parser)
      .output(MediaDbUpsertOutput.parser)
      .mutation(async ({ input }) => {
        return await config.ctx.mediaDb.upsert(input)
      }),
  }
}
