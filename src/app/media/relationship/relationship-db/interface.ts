import { z } from 'zod'
import { IDb } from '~/@/db/interface'
import { Media } from '../../media/media'
import { MediaId } from '../../media/media-id'
import { Relationship } from '../relationship'

const parser = IDb.parser({
  Entity: Relationship.parser,
  Related: z.object({
    media: z.record(MediaId.parser, Media.parser),
  }),
})

export type IRelationshipDb = IDb.Infer<typeof parser>

export const IRelationshipDb = {
  parser,
}
