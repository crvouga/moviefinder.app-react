import { z } from 'zod'
import { ImageSet } from '~/@/image-set'
import { MediaId } from './media-id'
import { createFaker } from '~/@/faker'

const parser = z.object({
  id: MediaId.parser,
  title: z.string().nullable(),
  description: z.string().nullable(),
  poster: ImageSet.parser,
  backdrop: ImageSet.parser,
  popularity: z.number().nullable(),
  releaseDate: z.string().nullable(),
})

export type Media = z.infer<typeof parser>

const random = async (override?: Partial<Media>): Promise<Media> => {
  const faker = await createFaker()

  return {
    id: MediaId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    title: faker.lorem.words(3),
    description: faker.lorem.paragraph(),
    poster: await ImageSet.random(),
    backdrop: await ImageSet.random(),
    popularity: Number((Math.random() * 100).toFixed(2)),
    releaseDate: faker.date.past().toISOString(),
    ...override,
  }
}

export const Media = {
  parser,
  random,
}
