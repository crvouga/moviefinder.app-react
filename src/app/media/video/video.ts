import { z } from 'zod'
import { MediaId } from '../media/media-id'
import { VideoId } from './video-id'

const parser = z.object({
  id: VideoId.parser,
  iso_639_1: z.string().nullable(),
  iso_3166_1: z.string().nullable(),
  name: z.string().nullable(),
  key: z.string().nullable(),
  site: z.string().nullable(),
  size: z.number().nullable(),
  type: z.string().nullable(),
  official: z.boolean().nullable(),
  publishedAt: z.string().nullable(),
  mediaId: MediaId.parser,
  order: z.number().nullable(),
})

export type Video = z.infer<typeof parser>

export const Video = {
  parser,
}
