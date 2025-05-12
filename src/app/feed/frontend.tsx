import { useEffect } from 'react'
import { ImageSet } from '~/@/image-set'
import { useSubscription } from '~/@/pub-sub'
import { NotAsked, Remote } from '~/@/result'
import { Img } from '~/@/ui/img'
import { PreloadImg } from '~/@/ui/preload-img'
import { Swiper } from '~/@/ui/swiper'
import { useCurrentScreen } from '../@/screen/use-current-screen'
import { useAppBottomButtons } from '../@/ui/app-bottom-buttons'
import { ScreenLayout } from '../@/ui/screen-layout'
import { useCtx } from '../frontend/ctx'
import { MediaDbQueryOutput } from '../media/media-db/interface/query-output'
import { Feed } from './feed'
import { FeedDbQueryOutput } from './feed-db/interface/query-output'
import { FeedId } from './feed-id'

export const FeedScreen = () => {
  const ctx = useCtx()

  const feedQuery = useSubscription(
    () =>
      ctx.feedDb.liveQuery({
        limit: 1,
        offset: 0,
        where: { op: '=', column: 'client-session-id', value: ctx.clientSessionId },
      }),
    [ctx]
  )

  const feed = FeedDbQueryOutput.first(feedQuery)

  useEffect(() => {
    if (feedQuery && !feed) {
      ctx.feedDb.upsert([
        { id: FeedId.generate(), activeIndex: 0, clientSessionId: ctx.clientSessionId },
      ])
    }
  }, [feedQuery])

  const mediaQuery = useSubscription(
    () =>
      ctx.mediaDb.liveQuery({
        limit: 20,
        offset: 0,
        orderBy: [{ column: 'popularity', direction: 'desc' }],
      }),
    [ctx]
  )

  const appBottomButtons = useAppBottomButtons()
  return (
    <ScreenLayout topBar={{ title: 'Feed' }} actions={appBottomButtons}>
      <ViewMediaDbQueryOutput media={mediaQuery ?? NotAsked} feed={feed} />
    </ScreenLayout>
  )
}

const ViewMediaDbQueryOutput = (props: {
  media: Remote | MediaDbQueryOutput
  feed: Feed | null
}) => {
  const currentScreen = useCurrentScreen()
  const ctx = useCtx()
  switch (props.media.t) {
    case 'not-asked':
    case 'loading': {
      return <Loading />
    }
    case 'error': {
      return <div>Error</div>
    }
    case 'ok': {
      if (props.media.value.media.items.length === 0) return <Loading />

      const { feed } = props

      if (!feed) return <Loading />

      return (
        <Swiper.Container
          initialSlide={feed.activeIndex}
          slidesPerView={1}
          className="h-full w-full"
          direction="vertical"
          onSlideChange={({ activeIndex }) => {
            ctx.feedDb.upsert([{ ...feed, activeIndex }])
          }}
        >
          {props.media.value.media.items.map((item) => (
            <Swiper.Slide key={item.id}>
              <button
                className="h-full w-full cursor-pointer"
                onClick={() => currentScreen.push({ type: 'media-details', mediaId: item.id })}
              >
                <Img
                  className="h-full w-full object-cover"
                  src={ImageSet.toHighestRes(item.poster)}
                  alt={item.title}
                />
                <PreloadImg image={ImageSet.toHighestRes(item.backdrop)} />
              </button>
            </Swiper.Slide>
          ))}
        </Swiper.Container>
      )
    }
  }
}

const Loading = () => {
  return <Img className="h-full w-full object-cover" alt="Loading..." />
}
