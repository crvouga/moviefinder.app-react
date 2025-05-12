import { OrderBy } from '~/@/query/order-by'
import { Where } from '~/@/query/where'

export type FeedColumn = 'id' | 'client-session-id'

export type FeedDbQueryInput = {
  limit: number
  offset: number
  orderBy?: OrderBy<FeedColumn>
  where?: Where<FeedColumn>
}
