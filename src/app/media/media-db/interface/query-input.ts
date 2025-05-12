import { z } from 'zod'

const MediaColumn = z.enum(['popularity'])

const parser = z.object({
  limit: z.number(),
  offset: z.number(),
  orderBy: z
    .array(
      z.object({
        column: MediaColumn,
        direction: z.enum(['asc', 'desc']),
      })
    )
    .nullish(),
})

export type MediaDbQueryInput = z.infer<typeof parser>

export const MediaDbQueryInput = {
  parser,
}
