import { z } from 'zod'
import { keyOf } from '~/@/zod/key-of'
import { OrderDirection } from './order-by/direction'

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

export const OrderBy = {
  parser,
}
