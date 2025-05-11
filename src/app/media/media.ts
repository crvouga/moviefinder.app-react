import { z } from 'zod'
import { ImageSet } from '~/@/image-set'
import { MediaId } from './media-id'

const parser = z.object({
  id: MediaId.parser,
  title: z.string(),
  description: z.string(),
  poster: ImageSet.parser,
  backdrop: ImageSet.parser,
})

export type Media = z.infer<typeof parser>

export const Media = {
  parser,
}
