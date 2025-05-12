import { z } from 'zod'
import { OrderBy } from './order-by'
import { Where } from './where'

const parser = <T>(column: z.ZodType<T>) => {
  return z.object({
    where: Where.parser(column),
    orderBy: OrderBy.parser(column),
    limit: z.number().optional(),
    offset: z.number().optional(),
  })
}

export type Query<T> = z.infer<ReturnType<typeof parser<T>>>

export const Query = {
  parser,
}
