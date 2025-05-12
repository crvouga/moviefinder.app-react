import { z } from 'zod'

const parser = z.enum(['asc', 'desc'])

export type OrderDirection = z.infer<typeof parser>

export const OrderDirection = {
  parser,
}
