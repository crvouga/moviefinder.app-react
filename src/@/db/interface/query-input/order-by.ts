import { z } from 'zod'
import { quoteIfPostgresKeyword } from '../postgres-keywords'
import { OrderDirection } from './order-by/direction'
import { keyOf } from '~/@/zod/key-of'
import { ascend, Comparator, descend } from '~/@/sort'
import { EntityField } from './field'

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

const sortMap = <TEntity extends Record<string, unknown>>(
  entities: Map<EntityField, TEntity>,
  _indexes: Map<EntityField, Map<string, Set<EntityField>>>, // indexes are not used for sorting, but kept for signature consistency if needed elsewhere
  orderBy: OrderBy<TEntity>
): TEntity[] => {
  const entitiesArray = Array.from(entities.values())
  return sortArray(entitiesArray, orderBy)
}

const sortArray = <TEntity extends Record<string, unknown>>(
  entities: TEntity[],
  orderBy: OrderBy<TEntity>
): TEntity[] => {
  return entities.sort(
    Comparator.combine(
      orderBy.map((o) => {
        switch (o.direction) {
          case 'asc':
            return ascend((entity) => entity[o.column])
          case 'desc':
            return descend((entity) => entity[o.column])
        }
      })
    )
  )
}

const toSql = <TEntity extends Record<string, unknown>>(
  orderBy: OrderBy<TEntity>,
  fieldToSqlColumn: (field: keyof TEntity) => string | number | symbol | null
): string => {
  const sql = orderBy
    .flatMap((o): string[] => {
      const sqlColumn = fieldToSqlColumn(o.column)
      if (!sqlColumn) return []
      return [`${quoteIfPostgresKeyword(sqlColumn)} ${o.direction.toUpperCase()}`]
    })
    .join(', ')
  return sql ? `ORDER BY ${sql}` : ''
}

export const OrderBy = {
  parser,
  sortArray,
  sortMap,
  toSql,
}
