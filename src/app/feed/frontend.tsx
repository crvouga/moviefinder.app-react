import { forwardRef, useEffect, useReducer } from 'react'
import { z } from 'zod'
import { ImageSet } from '~/@/image-set'
import { useSubscription } from '~/@/pub-sub'
import { Loading } from '~/@/result'
import { Img } from '~/@/ui/img'
import { WrapIntersectionObserver } from '~/@/ui/intersection-observer'
import { PreloadImg } from '~/@/ui/preload-img'
import { Swiper } from '~/@/ui/swiper'
import { useCurrentScreen } from '../@/screen/use-current-screen'
import { ScreenLayout } from '../@/ui/screen-layout'
import { useCtx } from '../frontend/ctx'
import { Media } from '../media/media'
import { Feed } from './feed'
import { FeedDbQueryOutput } from './feed-db/interface/query-output'
import { FeedId } from './feed-id'
import { FeedItem } from './feed-item'

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
        {
          id: FeedId.generate(),
          activeIndex: 0,
          clientSessionId: ctx.clientSessionId,
        },
      ])
    }
  }, [ctx, feedQuery, feed])

  return (
    <ScreenLayout topBar={{ title: 'Feed' }} includeAppBottomButtons>
      {feed ? <ViewFeed feed={feed} /> : <ImgLoading />}
    </ScreenLayout>
  )
}

const PAGE_SIZE = 5

type State = { limit: number; offset: number }

const initialState = (feed: Feed): State => {
  return { limit: PAGE_SIZE + 1, offset: Math.max(0, feed.activeIndex - PAGE_SIZE) }
}

type Action = { t: 'observed-first-slide' } | { t: 'observed-last-slide' }

const reducer = (state: State, action: Action): State => {
  switch (action.t) {
    case 'observed-first-slide':
      return { ...state, offset: Math.max(0, state.offset - PAGE_SIZE) }
    case 'observed-last-slide':
      return { ...state, limit: state.limit + PAGE_SIZE }
  }
}

const ViewFeed = (props: { feed: Feed }) => {
  const ctx = useCtx()
  const [state, dispatch] = useReducer(reducer, initialState(props.feed))

  const mediaQuery = useSubscription(
    () =>
      ctx.mediaDb.liveQuery({
        ...state,
        orderBy: [{ column: 'popularity', direction: 'desc' }],
      }),
    [ctx, state]
  )

  const media = mediaQuery ?? Loading

  switch (media.t) {
    case 'error':
    case 'loading': {
      return <ImgLoading />
    }
    case 'ok': {
      if (media.value.media.items.length === 0) return <ImgLoading />

      const feedItems = FeedItem.fromPaginatedMedia(media.value.media)

      const hasFirstSlideLoader = state.offset > 0

      const initialSlideIndex =
        feedItems.findIndex((item) => item.feedIndex === props.feed.activeIndex) +
        (hasFirstSlideLoader ? 1 : 0)

      return (
        <Swiper.Container
          initialSlide={initialSlideIndex}
          slidesPerView={1}
          className="h-full w-full"
          direction="vertical"
          onSlideChange={(event) => {
            const parsed = z.object({ feedIndex: z.number().int().min(0) }).safeParse(event.data)
            if (parsed.success) {
              ctx.feedDb.upsert([{ ...props.feed, activeIndex: parsed.data.feedIndex }])
            }
          }}
        >
          {hasFirstSlideLoader && (
            <Swiper.Slide>
              <WrapIntersectionObserver onVisible={() => dispatch({ t: 'observed-first-slide' })}>
                <ImgLoading />
              </WrapIntersectionObserver>
            </Swiper.Slide>
          )}
          {feedItems.map((item) => (
            <Swiper.Slide key={item.media.id} data={{ feedIndex: item.feedIndex }}>
              <SlideContent item={item.media} />
            </Swiper.Slide>
          ))}
          <Swiper.Slide>
            <WrapIntersectionObserver onVisible={() => dispatch({ t: 'observed-last-slide' })}>
              <ImgLoading />
            </WrapIntersectionObserver>
          </Swiper.Slide>
        </Swiper.Container>
      )
    }
  }
}

const SlideContent = (props: { item: Media }) => {
  const currentScreen = useCurrentScreen()
  return (
    <button
      className="h-full w-full cursor-pointer"
      onClick={() => currentScreen.push({ t: 'media-details', mediaId: props.item.id })}
    >
      <Img
        className="h-full w-full object-cover"
        src={ImageSet.toHighestRes(props.item.poster)}
        alt={props.item.title}
      />
      <PreloadImg image={ImageSet.toHighestRes(props.item.backdrop)} />
    </button>
  )
}

const ImgLoading = forwardRef<HTMLDivElement | HTMLImageElement>((_props, ref) => {
  return <Img className="h-full w-full object-cover" alt="Loading..." ref={ref} />
})
