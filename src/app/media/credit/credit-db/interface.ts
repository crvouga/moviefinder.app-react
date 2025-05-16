import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Credit } from '../credit'

const parser = Db.parser({
  Field: z.enum(['id', 'mediaId', 'personId', 'job', 'character', 'order', 'type']),
  Entity: Credit.parser,
  Related: z.object({}),
})

export type ICreditDb = Db.Infer<typeof parser>

export const ICreditDb = {
  parser,
}
