import { forwardRef, useEffect, useRef, useState } from 'react'
import { ImageSet } from '~/@/image-set'
import { useSubscription } from '~/@/pub-sub'
import { Loading } from '~/@/result'
import { Img } from '~/@/ui/img'
import { PreloadImg } from '~/@/ui/preload-img'
import { Swiper } from '~/@/ui/swiper'
import { useCurrentScreen } from '../@/screen/use-current-screen'
import { ScreenLayout } from '../@/ui/screen-layout'
import { useCtx } from '../frontend/ctx'
import { Media } from '../media/media'
import { Feed } from './feed'
import { FeedDbQueryOutput } from './feed-db/interface/query-output'
import { FeedId } from './feed-id'
import { useIntersectionObserver } from '~/@/ui/intersection-observer'

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
const ViewFeed = (props: { feed: Feed }) => {
  const ctx = useCtx()

  const [state, setState] = useState<{ limit: number; offset: number }>({
    limit: PAGE_SIZE,
    offset: Math.max(0, props.feed.activeIndex - PAGE_SIZE),
  })
  const lastSlideRef = useRef<HTMLDivElement | HTMLImageElement>(null)
  useIntersectionObserver(lastSlideRef, () => {
    setState((prev) => ({
      ...prev,
      limit: prev.limit + PAGE_SIZE,
    }))
  })

  const firstSlideRef = useRef<HTMLDivElement | HTMLImageElement>(null)
  useIntersectionObserver(firstSlideRef, () => {
    setState((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - PAGE_SIZE),
    }))
  })

  const mediaQuery = useSubscription(
    () =>
      ctx.mediaDb.liveQuery({
        limit: state.limit,
        offset: state.offset,
        orderBy: [{ column: 'popularity', direction: 'desc' }],
      }),
    [ctx, state.limit, state.offset]
  )

  const media = mediaQuery ?? Loading

  switch (media.t) {
    case 'error':
    case 'loading': {
      return <ImgLoading />
    }
    case 'ok': {
      if (media.value.media.items.length === 0) return <ImgLoading />

      return (
        <Swiper.Container
          initialSlide={props.feed.activeIndex}
          slidesPerView={1}
          className="h-full w-full"
          direction="vertical"
          onSlideChange={({ activeIndex }) => {
            ctx.feedDb.upsert([{ ...props.feed, activeIndex }])
          }}
        >
          {state.offset > 0 && (
            <Swiper.Slide>
              <ImgLoading ref={firstSlideRef} />
            </Swiper.Slide>
          )}
          {media.value.media.items.map((item) => (
            <Swiper.Slide key={item.id}>
              <SlideContent item={item} />
            </Swiper.Slide>
          ))}
          <Swiper.Slide>
            <ImgLoading ref={lastSlideRef} />
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
      onClick={() => currentScreen.push({ type: 'media-details', mediaId: props.item.id })}
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
