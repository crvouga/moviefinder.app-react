import { z } from 'zod'
import { Codec } from '~/@/codec'
import { MediaId } from '~/app/media/media-id'

const parser = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('feed'),
  }),
  z.object({
    t: z.literal('account'),
  }),
  z.object({
    t: z.literal('media-details'),
    mediaId: MediaId.parser,
  }),
  z.object({
    t: z.literal('login'),
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
