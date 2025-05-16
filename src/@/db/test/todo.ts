import { z } from 'zod'
import { createFaker } from '~/@/faker'

const parser = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
})

export type Todo = z.infer<typeof parser>

const random = async (override?: Partial<Todo>): Promise<Todo> => {
  const faker = await createFaker()
  const now = new Date()

  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence(),
    completed: faker.datatype.boolean(),
    createdAt: now,
    updatedAt: null,
    ...override,
  }
}

export const Todo = {
  parser,
  random,
}
