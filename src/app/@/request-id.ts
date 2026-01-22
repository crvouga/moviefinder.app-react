import { z } from 'zod'
import { randomUUID } from '~/@/uuid'

const parser = z.string().brand('RequestId')

export type RequestId = z.infer<typeof parser>

export const generate = (): RequestId => {
  return parser.parse(`request:${randomUUID()}`)
}

export const RequestId = {
  parser,
  generate,
}
