import { z } from 'zod'

const parser = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('index'),
  }),
  z.object({
    t: z.literal('pglite-repl'),
  }),
])

export type IMoreScreen = z.infer<typeof parser>

export const IMoreScreen = {
  parser,
}
