import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { Relationship } from '../relationship'

const parser = Db.parser({
  Field: z.enum(['id', 'from', 'to', 'type', 'order']),
  Entity: Relationship.parser,
  Related: z.object({
    media: z.record(MediaId.parser, Media.parser),
  }),
})

export type IRelationshipDb = Db.Infer<typeof parser>

export const IRelationshipDb = {
  parser,
}
