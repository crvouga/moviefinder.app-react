import { z } from 'zod'
import { Paginated } from '~/@/pagination/paginated'
import { Result } from '~/@/result'
import { AppErr } from '~/app/@/error'
import { Media } from '../../media'
import { Person } from '../../person/person'

const parser = Result.parser(
  z.object({
    media: Paginated.parser(Media.parser),
    person: Paginated.parser(Person.parser),
  }),
  AppErr.parser
)

export type MediaDbQueryOutput = z.infer<typeof parser>

export const MediaDbQueryOutput = {
  parser,
}
