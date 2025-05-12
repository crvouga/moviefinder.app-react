import { z } from 'zod'

const parser = z.string()

export type FeedId = z.infer<typeof parser>

const generate = (): FeedId => {
  return parser.parse(`feed:${crypto.randomUUID()}`)
}

export const FeedId = {
  parser,
  generate,
}
