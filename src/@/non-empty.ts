import { z } from 'zod'

export type NonEmpty<T> = [T, ...T[]]

const parser = <T>(item: z.ZodType<T>) => {
  return z
    .array(item)
    .min(1, { message: 'Array must contain at least one item' })
    .transform((arr): NonEmpty<T> => {
      if (arr.length === 0) {
        throw new Error('Array must contain at least one item')
      }
      return arr as NonEmpty<T>
    })
}

const is = <T>(value: T[] | NonEmpty<T>): value is NonEmpty<T> => {
  return Array.isArray(value) && value.length > 0
}

const map = <T, U>(value: NonEmpty<T>, mapFn: (value: T) => U): NonEmpty<U> => {
  return value.map(mapFn) as NonEmpty<U>
}

export const NonEmpty = {
  parser,
  is,
  map,
}
