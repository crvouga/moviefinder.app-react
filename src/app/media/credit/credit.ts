import { z } from 'zod'
import { createFaker } from '~/@/faker'
import { MediaId } from '../media/media-id'
import { PersonId } from '../person/person-id'
import { CreditId } from './credit-id'
import { CreditType } from './credit-type'

const parser = z.object({
  id: CreditId.parser,
  mediaId: MediaId.parser,
  personId: PersonId.parser,
  job: z.string().nullable(),
  character: z.string().nullable(),
  order: z.number().nullable(),
  type: CreditType.parser,
  //
  computedIsDirector: z.boolean().nullable(),
  computedIsCast: z.boolean().nullable(),
})

export type Credit = z.infer<typeof parser>

const random = async (override?: Partial<Credit>): Promise<Credit> => {
  const faker = await createFaker()

  return {
    type: await CreditType.random(),
    id: CreditId.fromTmdbId(Math.floor(Math.random() * 1000000).toString()),
    mediaId: MediaId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    personId: PersonId.fromTmdbId(Math.floor(Math.random() * 1000000)),
    job: faker.person.jobTitle(),
    character: faker.person.jobTitle(),
    order: Math.floor(Math.random() * 100),
    computedIsDirector: Math.random() > 0.5,
    computedIsCast: Math.random() > 0.5,
    ...override,
  }
}

const compute = (credit: Credit): Credit => {
  return {
    ...credit,
    computedIsDirector: Boolean(credit.job?.toLowerCase().startsWith('director') ?? null),
    computedIsCast: credit.type === 'cast',
  }
}

export const Credit = {
  parser,
  random,
  compute,
}
