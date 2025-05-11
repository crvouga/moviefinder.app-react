import { z } from 'zod'

const parser = z.string().brand('RequestId')

export type RequestId = z.infer<typeof parser>

export const generate = (): RequestId => {
  return parser.parse(`request:${crypto.randomUUID()}`)
}

export const RequestId = {
  parser,
  generate,
}
