import { Paginated } from '~/@/pagination/paginated'
import { OrderBy } from '~/@/query/order-by'
import { Where } from '~/@/query/where'
import { Result } from '~/@/result'
import { Feed } from '../feed'
import { Sub } from '~/@/pub-sub'

export type FeedColumn = 'id' | 'client-session-id'

export type FeedDbQueryInput = {
  limit: number
  offset: number
  orderBy?: OrderBy<FeedColumn>
  where?: Where<FeedColumn>
}

export type FeedDbQueryOutput = Result<Paginated<Feed>, Error>

export type IFeedDb = {
  query: (input: FeedDbQueryInput) => Promise<FeedDbQueryOutput>
  liveQuery: (input: FeedDbQueryInput) => Sub<FeedDbQueryOutput>
  upsert: (feed: Feed[]) => Promise<Result<null, Error>>
}
