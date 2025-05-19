import { z } from 'zod'

const parser = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('send-code'),
  }),
  z.object({
    t: z.literal('verify-code'),
    phoneNumber: z.string(),
  }),
])

export type ILoginScreen = z.infer<typeof parser>

export const ILoginScreen = {
  parser,
}
