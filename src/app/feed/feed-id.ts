import { z } from 'zod'
import { randomUUID } from '~/@/uuid'

const parser = z.string()

export type FeedId = z.infer<typeof parser>

const generate = (): FeedId => {
  return parser.parse(`feed:${randomUUID()}`)
}

const fromString = (id: string): FeedId => {
  return parser.parse(id)
}

export const FeedId = {
  parser,
  generate,
  fromString,
}
