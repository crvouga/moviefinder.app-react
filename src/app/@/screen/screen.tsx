import { z } from 'zod'
import { Codec } from '~/@/codec'
import { MediaId } from '~/app/media/media/media-id'
import { PersonId } from '~/app/media/person/person-id'
import { LoginScreen } from '~/app/user/login/@/login-screen'

const ScreenFrom = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('media-details'),
    mediaId: MediaId.parser,
  }),
  z.object({
    t: z.literal('person-details'),
    personId: PersonId.parser,
  }),
  z.object({
    t: z.literal('feed'),
  }),
])

export type ScreenFrom = z.infer<typeof ScreenFrom>

const parser = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('feed'),
  }),
  z.object({
    t: z.literal('account'),
  }),
  z.object({
    t: z.literal('login'),
    c: LoginScreen.parser,
  }),
  z.object({
    t: z.literal('media-details'),
    mediaId: MediaId.parser,
    from: ScreenFrom.nullish(),
  }),
  z.object({
    t: z.literal('person-details'),
    personId: PersonId.parser,
    from: ScreenFrom.nullish(),
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
