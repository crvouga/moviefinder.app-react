import { z } from 'zod'

const parser = z.string()

export type FeedId = z.infer<typeof parser>

const generate = (): FeedId => {
  return parser.parse(`feed:${crypto.randomUUID()}`)
}

const fromString = (id: string): FeedId => {
  return parser.parse(id)
}

export const FeedId = {
  parser,
  generate,
  fromString,
}
