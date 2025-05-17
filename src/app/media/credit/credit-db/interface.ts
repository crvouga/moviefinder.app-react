import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Person } from '../../person/person'
import { PersonId } from '../../person/person-id'
import { Credit } from '../credit'

const parser = Db.parser({
  Entity: Credit.parser,
  Related: z.object({
    person: z.record(PersonId.parser, Person.parser),
  }),
})

export type ICreditDb = Db.Infer<typeof parser>

export const ICreditDb = {
  parser,
}
