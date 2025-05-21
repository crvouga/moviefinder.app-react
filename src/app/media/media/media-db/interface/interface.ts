import { z } from 'zod'
import { IDb } from '~/@/db/interface'
import { Credit } from '~/app/media/credit/credit'
import { CreditId } from '~/app/media/credit/credit-id'
import { Person } from '~/app/media/person/person'
import { PersonId } from '~/app/media/person/person-id'
import { Relationship } from '~/app/media/relationship/relationship'
import { RelationshipId } from '~/app/media/relationship/relationship-id'
import { Video } from '~/app/media/video/video'
import { VideoId } from '../../../video/video-id'
import { Media } from '../../media'
import { MediaId } from '../../media-id'

const MediaRelated = z.object({
  person: z.record(PersonId.parser, Person.parser),
  credit: z.record(CreditId.parser, Credit.parser),
  relationship: z.record(RelationshipId.parser, Relationship.parser),
  media: z.record(MediaId.parser, Media.parser),
  video: z.record(VideoId.parser, Video.parser),
})

export type MediaRelated = z.infer<typeof MediaRelated>

const parser = IDb.parser({
  Entity: Media.parser,
  Related: MediaRelated,
})

export type IMediaDb = IDb.Infer<typeof parser>

export const IMediaDb = {
  parser,
}
