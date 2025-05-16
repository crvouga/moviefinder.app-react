import { z } from 'zod'
import { Paginated } from '~/@/pagination/paginated'
import { Result } from '~/@/result'
import { AppErr } from '~/app/@/error'
import { Credit } from '../../credit/credit'
import { Media } from '../../media'
import { Person } from '../../person/person'
import { Relationship } from '../../relationship/relationship'
import { Video } from '../../video/video'



const parser = Result.parser(
  z.object({
    media: Paginated.parser(Media.parser),
    person: z.array(Person.parser),
    credit: z.array(Credit.parser),
    relationship: z.array(Relationship.parser),
    related: z.array(Media.parser),
    video: z.array(Video.parser),
  }),
  AppErr.parser
)

export type MediaDbQueryOutput = z.infer<typeof parser>

export const MediaDbQueryOutput = {
  parser,
}
