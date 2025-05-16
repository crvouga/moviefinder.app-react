import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Relationship } from '../relationship'

const parser = Db.parser({
  Field: z.enum(['id', 'from', 'to', 'type']),
  Entity: Relationship.parser,
  Related: z.object({}),
})

export type IRelationshipDb = Db.Infer<typeof parser>

export const IRelationshipDb = {
  parser,
}
