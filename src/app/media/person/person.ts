import { z } from 'zod'
import { createFaker } from '~/@/faker'
import { ImageSet } from '~/@/image-set'
import { PersonId } from './person-id'

const parser = z.object({
  id: PersonId.parser,
  name: z.string().nullable(),
  profile: ImageSet.parser,
  popularity: z.number().nullable(),
})

export type Person = z.infer<typeof parser>

const random = async (override?: Partial<Person>): Promise<Person> => {
  const faker = await createFaker()

  return {
    id: PersonId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    name: faker.person.fullName(),
    profile: await ImageSet.random(),
    popularity: Number((Math.random() * 100).toFixed(2)),
    ...override,
  }
}

export const Person = {
  parser,
  random,
}
