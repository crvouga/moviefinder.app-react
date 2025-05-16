import { OrderBy } from "~/@/db/interface/query-input/order-by"
import { Where } from "~/@/db/interface/query-input/where"


export type FeedColumn = 'id' | 'client-session-id'

export type FeedDbQueryInput = {
  limit: number
  offset: number
  orderBy?: OrderBy<FeedColumn>
  where?: Where<FeedColumn>
}
