import { z } from 'zod'
import { Db } from '~/@/db/interface'
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

const parser = Db.parser({
  Entity: Media.parser,
  Related: z.object({
    person: z.record(PersonId.parser, Person.parser),
    credit: z.record(CreditId.parser, Credit.parser),
    relationship: z.record(RelationshipId.parser, Relationship.parser),
    media: z.record(MediaId.parser, Media.parser),
    video: z.record(VideoId.parser, Video.parser),
  }),
})

export type IMediaDb = Db.Infer<typeof parser>

export const IMediaDb = {
  parser,
}
