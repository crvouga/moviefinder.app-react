import { z } from 'zod'

const parser = z.object({
  limit: z.number(),
  offset: z.number(),
})

export type MediaDbQueryInput = z.infer<typeof parser>

export const MediaDbQueryInput = {
  parser,
}
