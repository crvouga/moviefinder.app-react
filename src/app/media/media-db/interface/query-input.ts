import { z } from 'zod'
import { OrderBy } from '~/@/db/interface/query-input/order-by'
import { Where } from '~/@/db/interface/query-input/where'

export const MediaColumn = z.enum(['id', 'popularity'])

export type MediaColumn = z.infer<typeof MediaColumn>

const parser = z.object({
  limit: z.number(),
  offset: z.number(),
  where: Where.parser(MediaColumn).nullish(),
  orderBy: OrderBy.parser(MediaColumn).nullish(),
})

export type MediaDbQueryInput = z.infer<typeof parser>

export const MediaDbQueryInput = {
  parser,
}
