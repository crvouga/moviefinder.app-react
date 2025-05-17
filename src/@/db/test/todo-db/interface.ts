import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Todo } from '../todo'

const parser = Db.parser({
  Entity: Todo.parser,
  Related: z.object({}),
})

export type ITodoDb = Db.Infer<typeof parser>

export const ITodoDb = {
  parser,
}
