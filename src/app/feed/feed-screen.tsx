import { forwardRef, useEffect, useReducer } from 'react'
import { z } from 'zod'
import { QueryOutput } from '~/@/db/interface/query-output/query-output'
import { ImageSet } from '~/@/image-set'
import { Loading } from '~/@/result'
import { Img } from '~/@/ui/img'
import { WrapIntersectionObserver } from '~/@/ui/intersection-observer'
import { PreloadImg } from '~/@/ui/preload-img'
import { Swiper } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { useCurrentScreen } from '../@/screen/use-current-screen'
import { ScreenLayout } from '../@/ui/screen-layout'
import { useCtx } from '../frontend/ctx'
import { Media } from '../media/media/media'
import { MediaId } from '../media/media/media-id'
import { Feed } from './feed'
import { FeedId } from './feed-id'
import { FeedItem } from './feed-item'

export const FeedScreen = () => {
  const ctx = useCtx()

  const feedQuery = useSubscription(['feed-query', ctx.clientSessionId], () =>
    ctx.feedDb.liveQuery({
      limit: 1,
      offset: 0,
      where: { op: '=', column: 'client-session-id', value: ctx.clientSessionId },
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
    <ScreenLayout topBar={{ title: 'Feed' }} includeAppBottomButtons>
      {feed ? <ViewFeed feed={feed} /> : <ImgLoading />}
    </ScreenLayout>
  )
}

const PAGE_SIZE = 5

const SlideData = z.object({
  feedIndex: z.number().int().min(0),
  mediaId: MediaId.parser,
  slideIndex: z.number().int().min(0),
})
type SlideData = z.infer<typeof SlideData>

type Msg = { t: 'observed-first' } | { t: 'observed-last' }

type State = { limit: number; offset: number }

const init = (feed: Feed): State => {
  return { limit: PAGE_SIZE + 1, offset: Math.max(0, feed.activeIndex - PAGE_SIZE) }
}

const reducer = (state: State, msg: Msg): State => {
  switch (msg.t) {
    case 'observed-first':
      return { ...state, offset: Math.max(0, state.offset - PAGE_SIZE) }
    case 'observed-last':
      return { ...state, limit: state.limit + PAGE_SIZE }
  }
}

const ViewFeed = (props: { feed: Feed }) => {
  const ctx = useCtx()
  const [state, dispatch] = useReducer(reducer, init(props.feed))

  const mediaQuery = useSubscription(
    ['media-query', 'offset', state.offset, 'limit', state.limit],
    () =>
      ctx.mediaDb.liveQuery({
        limit: state.limit,
        offset: state.offset,
        orderBy: [{ column: 'popularity', direction: 'desc' }],
      })
  )

  const media = mediaQuery ?? Loading

  switch (media.t) {
    case 'error':
    case 'loading': {
      return <ImgLoading />
    }
    case 'ok': {
      if (media.value.entities.items.length === 0) return <ImgLoading />

      const feedItems = FeedItem.fromPaginatedMedia(media.value.entities)

      const initialSlideIndex = feedItems.findIndex(
        (item) => item.feedIndex === props.feed.activeIndex
      )

      return (
        <Swiper.Container
          initialSlide={initialSlideIndex}
          slidesPerView={1}
          className="h-full w-full"
          direction="vertical"
          onSlideChange={(event) => {
            const parsed = SlideData.safeParse(event.data)

            if (!parsed.success) return

            ctx.feedDb.upsert({
              entities: [{ ...props.feed, activeIndex: parsed.data.feedIndex }],
            })
            ctx.mediaDb.query({
              where: { op: '=', column: 'id', value: parsed.data.mediaId },
              limit: 1,
              offset: 0,
            })
          }}
        >
          <Swiper.Slide>
            <WrapIntersectionObserver onVisible={() => dispatch({ t: 'observed-first' })}>
              <ImgLoading />
            </WrapIntersectionObserver>
          </Swiper.Slide>

          {feedItems.map((item, slideIndex) => {
            const data: SlideData = {
              slideIndex: slideIndex,
              feedIndex: item.feedIndex,
              mediaId: item.media.id,
            }
            return (
              <Swiper.Slide key={item.media.id} data={data}>
                <SlideContent item={item.media} />
              </Swiper.Slide>
            )
          })}

          <Swiper.Slide>
            <WrapIntersectionObserver onVisible={() => dispatch({ t: 'observed-last' })}>
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
      onClick={() =>
        currentScreen.push({ t: 'media-details', mediaId: props.item.id, from: { t: 'feed' } })
      }
    >
      <Img
        className="h-full w-full object-cover"
        src={ImageSet.toHighestRes(props.item.poster)}
        alt={props.item.title ?? ''}
      />
      <PreloadImg image={ImageSet.toHighestRes(props.item.backdrop)} />
    </button>
  )
}

const ImgLoading = forwardRef<HTMLDivElement | HTMLImageElement>((_props, ref) => {
  return <Img className="h-full w-full object-cover" alt="Loading..." ref={ref} />
})
