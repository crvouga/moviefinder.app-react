import { z } from 'zod'

const MediaColumn = z.enum(['id', 'popularity'])

const parser = z.object({
  limit: z.number(),
  offset: z.number(),
  where: z
    .discriminatedUnion('op', [
      z.object({ op: z.literal('='), column: MediaColumn, value: z.string() }),
      z.object({ op: z.literal('in'), column: MediaColumn, value: z.array(z.string()) }),
    ])
    .nullish(),
  orderBy: z.array(z.object({ column: MediaColumn, direction: z.enum(['asc', 'desc']) })).nullish(),
})

export type MediaDbQueryInput = z.infer<typeof parser>

export const MediaDbQueryInput = {
  parser,
}
