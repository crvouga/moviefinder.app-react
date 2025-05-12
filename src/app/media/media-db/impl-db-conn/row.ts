import { z } from 'zod'
import { ImageSet } from '~/@/image-set'
import { Media } from '../../media'
import { MediaId } from '../../media-id'

const parser = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  poster_urls: z.array(z.string()),
  backdrop_urls: z.array(z.string()),
  popularity: z.number(),
})

export type Row = z.infer<typeof parser>

const toMedia = (row: Row): Media => {
  return {
    id: MediaId.fromString(row.id),
    title: row.title,
    description: row.description,
    poster: ImageSet.init({
      lowestToHighestRes: row.poster_urls,
    }),
    backdrop: ImageSet.init({
      lowestToHighestRes: row.backdrop_urls,
    }),
    popularity: row.popularity,
  }
}

export const Row = {
  parser,
  toMedia,
}
