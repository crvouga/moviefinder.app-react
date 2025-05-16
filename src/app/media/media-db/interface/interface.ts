import { z } from 'zod'
import { Db } from '~/@/db/interface'
import { Credit } from '../../credit/credit'
import { CreditId } from '../../credit/credit-id'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { Person } from '../../person/person'
import { PersonId } from '../../person/person-id'
import { Relationship } from '../../relationship/relationship'
import { RelationshipId } from '../../relationship/relationship-id'
import { Video } from '../../video/video'
import { VideoId } from '../../video/video-id'

export const MediaField = z.enum(['id', 'popularity'])

export type MediaField = z.infer<typeof MediaField>

const parser = Db.parser({
  Field: MediaField,
  Entity: Media.parser,
  Related: z.object({
    person: z.record(PersonId.parser, Person.parser),
    credit: z.record(CreditId.parser, Credit.parser),
    relationship: z.record(RelationshipId.parser, Relationship.parser),
    related: z.record(MediaId.parser, Media.parser),
    video: z.record(VideoId.parser, Video.parser),
  }),
})

export type IMediaDb = Db.Infer<typeof parser>

export const IMediaDb = {
  parser,
}
