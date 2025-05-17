import { z } from 'zod'
import { IDb } from '~/@/db/interface'
import { Person } from '../person'

const parser = IDb.parser({
  Entity: Person.parser,
  Related: z.object({}),
})

export type IPersonDb = IDb.Infer<typeof parser>

export const IPersonDb = {
  parser,
}
