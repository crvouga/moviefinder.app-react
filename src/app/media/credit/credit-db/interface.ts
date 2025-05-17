import { z } from 'zod'
import { IDb } from '~/@/db/interface'
import { Person } from '../../person/person'
import { PersonId } from '../../person/person-id'
import { Credit } from '../credit'

const parser = IDb.parser({
  Entity: Credit.parser,
  Related: z.object({
    person: z.record(PersonId.parser, Person.parser),
  }),
})

export type ICreditDb = IDb.Infer<typeof parser>

export const ICreditDb = {
  parser,
}
