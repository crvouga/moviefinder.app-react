import { z } from 'zod'
import { IDb } from '~/@/db/interface'
import { Todo } from '../todo'

const parser = IDb.parser({
  Entity: Todo.parser,
  Related: z.object({}),
})

export type ITodoDb = IDb.Infer<typeof parser>

export const ITodoDb = {
  parser,
}
