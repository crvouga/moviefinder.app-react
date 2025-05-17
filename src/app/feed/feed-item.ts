import { z } from 'zod'
import { Media } from '../media/media/media'
import { Paginated } from '~/@/pagination/paginated'

const parser = z.discriminatedUnion('t', [
  z.object({
    t: z.literal('media'),
    media: Media.parser,
    feedIndex: z.number().int().min(0),
  }),
])

export type FeedItem = z.infer<typeof parser>

const fromPaginatedMedia = (media: Paginated<Media>): FeedItem[] => {
  return media.items.map((item, index) => ({
    t: 'media',
    media: item,
    feedIndex: index + media.offset,
  }))
}

export const FeedItem = {
  parser,
  fromPaginatedMedia,
}
