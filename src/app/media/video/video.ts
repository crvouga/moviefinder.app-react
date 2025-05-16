import { z } from 'zod'

const parser = z.object({
  id: z.string().optional(),
  iso_639_1: z.string().optional(),
  iso_3166_1: z.string().optional(),
  name: z.string().optional(),
  key: z.string().optional(),
  site: z.string().optional(),
  size: z.number().optional(),
  type: z.string().optional(),
  official: z.boolean().optional(),
  published_at: z.string().optional(),
})

export type Video = z.infer<typeof parser>

export const Video = {
  parser,
}
