import { z } from 'zod'
import { Codec } from '~/@/codec'
import { MediaId } from '~/app/media/media/media-id'
import { PersonId } from '~/app/media/person/person-id'
import { ILoginScreen } from '~/app/user/login/@/login-screen-types'
import { IUserScreen } from '~/app/user/@/user-screen-types'

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
    t: z.literal('user'),
    c: IUserScreen.parser,
  }),
  z.object({
    t: z.literal('login'),
    c: ILoginScreen.parser,
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

export type ICurrentScreen = z.infer<typeof parser>

const encode = (screen: ICurrentScreen) => {
  return btoa(JSON.stringify(screen))
}

const decode = (screen: string): ICurrentScreen | null => {
  const parsed = parser.safeParse(JSON.parse(atob(screen)))
  if (!parsed.success) return null
  return parsed.data
}

const codec: Codec<ICurrentScreen> = {
  encode,
  decode,
}

export const ICurrentScreen = {
  ...parser,
  ...codec,
}
