import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Media } from '../../media/media'
import { MediaId } from '../../media/media-id'
import { Relationship } from '../relationship'

const parser = Db.parser({
  Entity: Relationship.parser,
  Related: z.object({
    media: z.record(MediaId.parser, Media.parser),
  }),
})

export type IRelationshipDb = Db.Infer<typeof parser>

export const IRelationshipDb = {
  parser,
}
