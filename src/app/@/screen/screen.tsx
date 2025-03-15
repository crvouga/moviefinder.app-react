import { z } from 'zod'
import { Codec } from '~/@/codec'

const parser = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('home'),
  }),
  z.object({
    type: z.literal('account'),
  }),
])

type Screen = z.infer<typeof parser>

const encode = (screen: Screen) => {
  return btoa(JSON.stringify(screen))
}

const decode = (screen: string): Screen | null => {
  const parsed = parser.safeParse(JSON.parse(atob(screen)))
  if (!parsed.success) return null
  return parsed.data
}

const codec: Codec<Screen> = {
  encode,
  decode,
}

export const Screen = {
  ...parser,
  ...codec,
}
