import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Person } from '../person'

const parser = Db.parser({
  Field: z.enum(['id', 'name', 'popularity']),
  Entity: Person.parser,
  Related: z.object({}),
})

export type IPersonDb = Db.Infer<typeof parser>

export const IPersonDb = {
  parser,
}
