import { z } from 'zod'
import { quoteIfPostgresKeyword } from '../postgres-keywords'
import { OrderDirection } from './order-by/direction'
import { keyOf } from '~/@/zod/key-of'
import { ascend, Comparator, descend } from '~/@/sort'

export type OrderBy<TEntity extends Record<string, unknown>> = {
  column: keyof TEntity
  direction: OrderDirection
}[]

const parser = <TEntity extends Record<string, unknown>>(
  column: z.ZodObject<z.ZodRawShape>
): z.ZodType<OrderBy<TEntity>> => {
  const schema = z.array(
    z.object({
      column: keyOf(column),
      direction: OrderDirection.parser,
    })
  )
  // @ts-ignore
  return schema
}

const sort = <TEntity extends Record<string, unknown>>(
  entities: TEntity[],
  orderBy: OrderBy<TEntity>
): TEntity[] => {
  return entities.sort(
    Comparator.combine(
      orderBy.map((o) => {
        switch (o.direction) {
          case 'asc':
            return ascend(
              (entity) =>
                // @ts-ignore
                entity[o.column]
            )
          case 'desc':
            return descend(
              (entity) =>
                // @ts-ignore
                entity[o.column]
            )
        }
      })
    )
  )
}

const toSql = <TEntity extends Record<string, unknown>>(
  orderBy: OrderBy<TEntity>,
  fieldToSqlColumn: (field: keyof TEntity) => string | number | symbol
): string => {
  const sql = orderBy
    .map(
      (o) => `${quoteIfPostgresKeyword(fieldToSqlColumn(o.column))} ${o.direction.toUpperCase()}`
    )
    .join(', ')
  return sql ? `ORDER BY ${sql}` : ''
}

export const OrderBy = {
  parser,
  sort,
  toSql,
}
