import { z } from 'zod'
import { OrderBy } from './order-by'
import { Where } from './where'

export type QueryInput<TEntity extends Record<string, unknown>> = {
  where?: Where<TEntity>
  orderBy?: OrderBy<TEntity>
  limit: number
  offset: number
}

const parser = <TEntity extends Record<string, unknown>>(
  column: z.ZodObject<z.ZodRawShape>
): z.ZodType<QueryInput<TEntity>> => {
  const schema = z.object({
    where: Where.parser(column).optional(),
    orderBy: OrderBy.parser(column).optional(),
    limit: z.number(),
    offset: z.number(),
  })
  // @ts-ignore
  return schema
}

const toSql = <TEntity extends Record<string, unknown>>(
  queryInput: QueryInput<TEntity>,
  columnToSqlColumn: (column: keyof TEntity) => string
): string => {
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
