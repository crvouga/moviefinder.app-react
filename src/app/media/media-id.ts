import { z } from 'zod'

const parser = z.string().brand('MediaId')

export type MediaId = z.infer<typeof parser>

export const MediaId = {
  parser,
}
