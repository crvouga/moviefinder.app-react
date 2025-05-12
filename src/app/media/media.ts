import { faker } from '@faker-js/faker'
import { z } from 'zod'
import { ImageSet } from '~/@/image-set'
import { MediaId } from './media-id'

const parser = z.object({
  id: MediaId.parser,
  title: z.string(),
  description: z.string(),
  poster: ImageSet.parser,
  backdrop: ImageSet.parser,
  popularity: z.number(),
  releaseDate: z.string().nullable(),
})

export type Media = z.infer<typeof parser>

const random = (override?: Partial<Media>): Media => {
  return {
    id: MediaId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    poster: ImageSet.random(),
    backdrop: ImageSet.random(),
    popularity: Number((Math.random() * 100).toFixed(2)),
    releaseDate: faker.date.past().toISOString(),
    ...override,
  }
}

export const Media = {
  parser,
  random,
}
