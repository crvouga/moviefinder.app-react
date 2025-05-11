import { z } from 'zod'
import { Media } from '../../media'

const parser = z.object({
  media: z.array(Media.parser),
})

export type MediaDbUpsertInput = z.infer<typeof parser>

export const MediaDbUpsertInput = {
  parser,
}
