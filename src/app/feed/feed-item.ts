import { z } from 'zod'
import { Media } from '../media/media'

const parser = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('media'),
    media: Media.parser,
    feedIndex: z.number().int().min(0),
  }),
])

export type FeedItem = z.infer<typeof parser>

export const FeedItem = {
  parser,
}
