import { z } from 'zod'
import { IMoreScreen } from '../more/@/more-screen-types'

const parser = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('account'),
  }),
  z.object({
    t: z.literal('more'),
    c: IMoreScreen.parser,
  }),
])

export type IUserScreen = z.infer<typeof parser>

export const IUserScreen = {
  parser,
}
