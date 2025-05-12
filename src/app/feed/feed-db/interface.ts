import { Result } from '~/@/result'
import { Feed } from '../feed'
import { FeedId } from '../feed-id'

export type IFeedDb = {
  get: (feedId: FeedId) => Promise<Result<Feed | null, Error>>
  put: (feed: Feed) => Promise<Result<null, Error>>
}
