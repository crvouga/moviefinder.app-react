import { z } from 'zod'

const parser = z.string().brand('ClientSessionId')

export type ClientSessionId = z.infer<typeof parser>

export const generate = (): ClientSessionId => {
  return parser.parse(`client-session:${crypto.randomUUID()}`)
}

export const ClientSessionId = {
  parser,
  generate,
}
