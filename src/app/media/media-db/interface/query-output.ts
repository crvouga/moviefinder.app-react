import { z } from 'zod'
import { Paginated } from '~/@/pagination/paginated'
import { Result } from '~/@/result'
import { AppErr } from '~/@/error'
import { Credit } from '../../credit/credit'
import { Media } from '../../media'
import { Person } from '../../person/person'
import { Relationship } from '../../relationship/relationship'
import { Video } from '../../video/video'
import { PersonId } from '../../person/person-id'
import { CreditId } from '../../credit/credit-id'
import { MediaId } from '../../media-id'
import { RelationshipId } from '../../relationship/relationship-id'
import { VideoId } from '../../video/video-id'


const parser = Result.parser(
  z.object({
    media: Paginated.parser(Media.parser),
    person: z.record(PersonId.parser, Person.parser),
    credit: z.record(CreditId.parser, Credit.parser),
    relationship: z.record(RelationshipId.parser, Relationship.parser),
    related: z.record(MediaId.parser, Media.parser),
    video: z.record(VideoId.parser, Video.parser),
  }),
  AppErr.parser
)

export type MediaDbQueryOutput = z.infer<typeof parser>

export const MediaDbQueryOutput = {
  parser,
}
