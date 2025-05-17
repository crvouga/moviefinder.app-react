import { forwardRef, useEffect, useState } from 'react'
import { z } from 'zod'
import { ImageSet } from '~/@/image-set'
import { Loading } from '~/@/result'
import { Img } from '~/@/ui/img'
import { PreloadImg } from '~/@/ui/preload-img'
import { Swiper } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { useCurrentScreen } from '../@/screen/use-current-screen'
import { ScreenLayout } from '../@/ui/screen-layout'
import { useCtx } from '../frontend/ctx'
import { Media } from '../media/media'
import { MediaId } from '../media/media-id'
import { Feed } from './feed'
import { FeedDbQueryOutput } from './feed-db/interface/query-output'
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

const SlideData = z.object({
  feedIndex: z.number().int().min(0),
  mediaId: MediaId.parser.nullable(),
  slideIndex: z.number().int().min(0),
})

const ViewFeed = (props: { feed: Feed }) => {
  const ctx = useCtx()
  const [state, setState] = useState({
    limit: PAGE_SIZE + 1,
    offset: Math.max(0, props.feed.activeIndex - PAGE_SIZE),
  })

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

      const onSlideChange = (event: { data: unknown }) => {
        const parsed = SlideData.safeParse(event.data)
        if (!parsed.success) return

        ctx.feedDb.upsert([{ ...props.feed, activeIndex: parsed.data.feedIndex }])

        const mediaId = parsed.data.mediaId
        if (mediaId) {
          ctx.mediaDb.query({
            where: { op: '=', column: 'id', value: mediaId },
            limit: 1,
            offset: 0,
          })
        }

        if (parsed.data.slideIndex >= feedItems.length - 1) {
          setState((prev) => ({
            ...prev,
            limit: prev.limit + PAGE_SIZE,
          }))
        } else if (parsed.data.slideIndex <= 0) {
          setState((prev) => ({ ...prev, offset: prev.offset - PAGE_SIZE }))
        }
      }

      return (
        <Swiper.Container
          initialSlide={initialSlideIndex}
          slidesPerView={1}
          className="h-full w-full"
          direction="vertical"
          onSlideChange={onSlideChange}
        >
          {feedItems.map((item, slideIndex) => (
            <Swiper.Slide
              key={item.media.id}
              data={{
                slideIndex: slideIndex,
                feedIndex: item.feedIndex,
                mediaId: item.media.id,
              }}
            >
              <SlideContent item={item.media} />
            </Swiper.Slide>
          ))}
          <Swiper.Slide
            data={{
              slideIndex: feedItems.length,
              feedIndex: feedItems[feedItems.length - 1]?.feedIndex ?? 0,
              mediaId: null,
            }}
          >
            <ImgLoading />
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
