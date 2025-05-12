import { z } from 'zod'
import { Codec } from '~/@/codec'

const parser = z.string().brand('ClientSessionId')

export type ClientSessionId = z.infer<typeof parser>

export const generate = (): ClientSessionId => {
  return parser.parse(`client-session:${crypto.randomUUID()}`)
}

const codec: Codec<ClientSessionId> = {
  encode: (value) => value,
  decode: (value) => parser.parse(value),
}

export const ClientSessionId = {
  parser,
  generate,
  codec,
}
