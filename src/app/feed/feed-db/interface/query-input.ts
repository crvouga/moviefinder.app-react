import { OrderBy } from "~/@/query/query-input/order-by"
import { Where } from "~/@/query/query-input/where"


export type FeedColumn = 'id' | 'client-session-id'

export type FeedDbQueryInput = {
  limit: number
  offset: number
  orderBy?: OrderBy<FeedColumn>
  where?: Where<FeedColumn>
}
