import { z } from 'zod'

const parser = z.object({
  id: z.string().nullable(),
  iso_639_1: z.string().nullable(),
  iso_3166_1: z.string().nullable(),
  name: z.string().nullable(),
  key: z.string().nullable(),
  site: z.string().nullable(),
  size: z.number().nullable(),
  type: z.string().nullable(),
  official: z.boolean().nullable(),
  publishedAt: z.string().nullable(),
})

export type Video = z.infer<typeof parser>

export const Video = {
  parser,
}
