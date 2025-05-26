import { useEffect, useReducer } from 'react'
import { z } from 'zod'
import { QueryInput } from '~/@/db/interface/query-input/query-input'
import { ImageSet } from '~/@/image-set'
import { Loading } from '~/@/result'
import { Img } from '~/@/ui/img'
import { WrapIntersectionObserver } from '~/@/ui/intersection-observer'
import { Swiper } from '~/@/ui/swiper'
import { useLiveQuery } from '~/@/ui/use-live-query'
import { useCurrentScreen } from '../../../@/screen/use-current-screen'
import { useCtx } from '../../../frontend/ctx'
import { Media } from '../../../media/media/media'
import { MediaDetailsScreen } from '../../../media/media/media-details-screen/media-details-screen'
import { MediaId } from '../../../media/media/media-id'
import { Feed } from '../../feed'
import { FeedItem } from '../../feed-item'
import { ImgLoading } from './img-loading'

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
  return {
    limit: PAGE_SIZE + 1,
    offset: Math.max(0, feed.activeIndex - PAGE_SIZE),
  }
}

const reducer = (state: State, msg: Msg): State => {
  switch (msg.t) {
    case 'observed-first': {
      return {
        ...state,
        offset: Math.max(0, state.offset - PAGE_SIZE),
      }
    }
    case 'observed-last': {
      return {
        ...state,
        limit: state.limit + PAGE_SIZE,
      }
    }
  }
}

const toQuery = (input: { offset: number; limit: number }): QueryInput<Media> => {
  return QueryInput.init<Media>({
    limit: input.limit,
    offset: input.offset,
    orderBy: [
      { column: 'popularity', direction: 'desc' },
      { column: 'id', direction: 'asc' },
    ],
  })
}

export const ViewFeed = (props: { feed: Feed }) => {
  const ctx = useCtx()
  const [state, dispatch] = useReducer(reducer, init(props.feed))

  const mediaQuery = useLiveQuery({
    queryCache: ctx.queryCache,
    queryKey: ['media-query', 'offset', state.offset, 'limit', state.limit].join('-'),
    queryFn: () => ctx.mediaDb.liveQuery(toQuery({ offset: state.offset, limit: state.limit })),
  })

  const media = mediaQuery ?? Loading

  useEffect(() => {}, [])

  if (media.t === 'error') return <ImgLoading />

  if (media.t === 'loading') return <ImgLoading />

  if (media.value.entities.items.length === 0) return <ImgLoading />

  const slideItems = FeedItem.fromPaginatedMedia(media.value.entities)

  const initialSlideIndex = slideItems.findIndex(
    (item) => item.feedIndex === props.feed.activeIndex
  )

  return (
    <Swiper.Container
      initialSlide={initialSlideIndex}
      slidesPerView={1}
      className="h-full w-full"
      direction="vertical"
      onSlideChange={async (event) => {
        const parsed = SlideData.parse(event.data)

        await ctx.feedDb.upsert({
          entities: [{ ...props.feed, activeIndex: parsed.feedIndex }],
        })

        await MediaDetailsScreen.preload({ ctx, mediaId: parsed.mediaId })
      }}
    >
      {slideItems.map((item, slideIndex) => {
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
        <WrapIntersectionObserver
          onVisible={() => {
            dispatch({ t: 'observed-last' })
          }}
        >
          <ImgLoading />
        </WrapIntersectionObserver>
      </Swiper.Slide>
    </Swiper.Container>
  )
}

const SlideContent = (props: { item: Media }) => {
  const currentScreen = useCurrentScreen()

  return (
    <button
      className="h-full w-full cursor-pointer"
      onClick={() => {
        currentScreen.push({
          t: 'media-details',
          mediaId: props.item.id,
          from: { t: 'feed' },
        })
      }}
    >
      <Img
        className="h-full w-full object-cover"
        src={ImageSet.toMiddleRes(props.item.poster)}
        alt={props.item.title ?? ''}
      />
    </button>
  )
}
