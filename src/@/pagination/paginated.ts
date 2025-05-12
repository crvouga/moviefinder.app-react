import { z } from 'zod'
import { Pagination } from './pagination'

const parser = <T>(t: z.ZodType<T>) => {
  return z.object({
    items: z.array(t),
    total: z.number(),
    offset: z.number(),
    limit: z.number(),
  })
}

export type Paginated<T> = z.infer<ReturnType<typeof parser<T>>>

const empty = <T>(pagination?: Partial<Pagination>): Paginated<T> => {
  return {
    items: [],
    total: 0,
    offset: pagination?.offset ?? 0,
    limit: pagination?.limit ?? 0,
  }
}

export const Paginated = {
  parser,
  empty,
}
