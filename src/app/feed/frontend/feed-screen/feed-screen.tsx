import { useEffect } from 'react'
import { QueryOutput } from '~/@/db/interface/query-output/query-output'
import { useSubscription } from '~/@/ui/use-subscription'
import { AppScreenLayout } from '../../../@/ui/app-screen-layout'
import { useCtx } from '../../../frontend/ctx'
import { FeedId } from '../../feed-id'
import { ViewFeed } from './view-feed'
import { ImgLoading } from './img-loading'

export const FeedScreen = () => {
  const ctx = useCtx()

  const feedQuery = useSubscription(['feed-query', ctx.clientSessionId], () =>
    ctx.feedDb.liveQuery({
      limit: 1,
      offset: 0,
      where: {
        op: '=',
        column: 'clientSessionId',
        value: ctx.clientSessionId,
      },
    })
  )

  const feed = QueryOutput.first(feedQuery)

  useEffect(() => {
    if (feedQuery && !feed) {
      ctx.feedDb.upsert({
        entities: [
          {
            id: FeedId.generate(),
            activeIndex: 0,
            clientSessionId: ctx.clientSessionId,
          },
        ],
      })
    }
  }, [ctx, feedQuery, feed])

  return (
    <AppScreenLayout scrollKey="feed" topBar={{ title: 'Feed' }} includeAppBottomButtons>
      {feed ? <ViewFeed feed={feed} /> : <ImgLoading />}
    </AppScreenLayout>
  )
}
