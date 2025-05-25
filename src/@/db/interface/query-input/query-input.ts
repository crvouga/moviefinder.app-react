import { z } from 'zod'
import { OrderBy } from './order-by'
import { Where } from './where'
import { toDeterministicHash } from '~/@/deterministic-hash'

export type QueryInput<TEntity extends Record<string, unknown>> = {
  where?: Where<TEntity>
  orderBy?: OrderBy<TEntity>
  limit: number
  offset: number
  key?: string
}

const parser = <TEntity extends Record<string, unknown>>(
  column: z.ZodObject<z.ZodRawShape>
): z.ZodType<QueryInput<TEntity>> => {
  const schema = z.object({
    where: Where.parser(column).optional(),
    orderBy: OrderBy.parser(column).optional(),
    limit: z.number(),
    offset: z.number(),
    key: z.string().optional(),
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

const toKey = <TEntity extends Record<string, unknown>>(
  queryInput: QueryInput<TEntity>
): string => {
  return toDeterministicHash(queryInput)
}

const ensureKey = <TEntity extends Record<string, unknown>>(
  queryInput: QueryInput<TEntity>
): QueryInput<TEntity> => {
  if (queryInput.key) return queryInput
  return { ...queryInput, key: toKey(queryInput) }
}

export const QueryInput = {
  parser,
  toSql,
  toKey,
  ensureKey,
}
