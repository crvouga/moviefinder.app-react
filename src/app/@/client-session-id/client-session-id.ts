import { z } from 'zod'
import { Codec } from '~/@/codec'
import { randomUUID } from '~/@/uuid'

const parser = z.string()

export type ClientSessionId = z.infer<typeof parser>

export const generate = (): ClientSessionId => {
  return parser.parse(`client-session:${randomUUID()}`)
}

const codec: Codec<ClientSessionId> = {
  encode: (value) => value,
  decode: (value) => parser.parse(value),
}

const fromString = (value: string): ClientSessionId => {
  return parser.parse(value)
}

export const ClientSessionId = {
  parser,
  generate,
  codec,
  fromString,
}
