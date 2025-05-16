import { z } from 'zod'
import { createFaker } from '~/@/faker'

const parser = z.enum(['cast', 'crew'])

export type CreditType = z.infer<typeof parser>

const random = async (_override?: Partial<CreditType>): Promise<CreditType> => {
  const faker = await createFaker()

  return faker.helpers.arrayElement(parser.options)
}

export const CreditType = {
  parser,
  random,
}
