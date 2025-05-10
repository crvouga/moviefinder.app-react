import { z } from 'zod'
import { MediaId } from './media-id'

const parser = z.object({
  id: MediaId.parser,
  title: z.string(),
  description: z.string(),
})

export type Media = z.infer<typeof parser>

export const Media = {
  parser,
}
