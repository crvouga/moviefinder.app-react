import { Sub } from '~/@/pub-sub'
import { Result } from '~/@/result'
import { Feed } from '../../feed'
import { FeedDbQueryInput } from './query-input'
import { FeedDbQueryOutput } from './query-output'

export type IFeedDb = {
  query: (input: FeedDbQueryInput) => Promise<FeedDbQueryOutput>
  liveQuery: (input: FeedDbQueryInput) => Sub<FeedDbQueryOutput>
  upsert: (feed: Feed[]) => Promise<Result<null, Error>>
}
