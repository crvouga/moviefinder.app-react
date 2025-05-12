import { z } from 'zod'
import { OrderDirection } from './order-by/direction'

const parser = <T>(column: z.ZodType<T>) => {
  return z.array(z.object({ column, direction: OrderDirection.parser }))
}

export type OrderBy<T> = z.infer<ReturnType<typeof parser<T>>>

const toSql = <T>(orderBy: OrderBy<T>, columnToSqlColumn: (column: T) => string) => {
  const sql = orderBy
    .map((o) => `${columnToSqlColumn(o.column as T)} ${o.direction.toUpperCase()}`)
    .join(', ')
  return sql ? `ORDER BY ${sql}` : ''
}

export const OrderBy = {
  parser,
  toSql,
}
