import { z } from 'zod'

const parser = z.string()

export type FeedId = z.infer<typeof parser>

export const FeedId = {
  parser,
}
