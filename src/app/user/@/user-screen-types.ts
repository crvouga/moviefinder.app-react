import { z } from 'zod'

const parser = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('account'),
  }),
  z.object({
    t: z.literal('more'),
    c: z.discriminatedUnion('t', [
      z.object({
        t: z.literal('index'),
      }),
      z.object({
        t: z.literal('pglite-repl'),
      }),
    ]),
  }),
])

export type IUserScreen = z.infer<typeof parser>

export const IUserScreen = {
  parser,
}
