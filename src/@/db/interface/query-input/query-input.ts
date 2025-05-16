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

export type QueryInput<T> = z.infer<ReturnType<typeof parser<T>>>

const toSql = <T>(queryInput: QueryInput<T>, columnToSqlColumn: (column: T) => string): string => {
  return [
    queryInput.where ? Where.toSql(queryInput.where, columnToSqlColumn) : '',
    queryInput.orderBy ? OrderBy.toSql(queryInput.orderBy, columnToSqlColumn) : '',
    queryInput.limit ? `LIMIT ${queryInput.limit}` : '',
    queryInput.offset ? `OFFSET ${queryInput.offset}` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export const QueryInput = {
  parser,
  toSql,
}
