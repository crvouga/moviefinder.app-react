import { z } from 'zod'

export type Codec<T> = {
  encode: (value: T) => string
  decode: (value: string) => T | null
}

const string: Codec<string> = {
  encode: (value) => value,
  decode: (value) => value,
}

const integer: Codec<number> = {
  encode: (value) => value.toString(),
  decode: (value) => parseInt(value),
}

const fromZod = <T>(schema: z.ZodType<T>): Codec<T> => {
  return {
    encode: (value) => {
      try {
        return JSON.stringify(schema.parse(value))
      } catch (error) {
        return ''
      }
    },
    decode: (value) => {
      try {
        return schema.parse(JSON.parse(value))
      } catch (error) {
        return null
      }
    },
  }
}

export const Codec = {
  string,
  integer,
  fromZod,
}
