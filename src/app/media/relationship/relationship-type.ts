import { z } from 'zod'
import { createFaker } from '~/@/faker'

const parser = z.enum(['recommendation', 'similar'])

export type RelationshipType = z.infer<typeof parser>

const random = async (_override?: Partial<RelationshipType>): Promise<RelationshipType> => {
  const faker = await createFaker()

  return faker.helpers.arrayElement(parser.options)
}

export const RelationshipType = {
  parser,
  random,
}
