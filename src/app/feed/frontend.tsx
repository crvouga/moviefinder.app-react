import { useEffect } from 'react'
import { ImageSet } from '~/@/image-set'
import { useSubscription } from '~/@/pub-sub'
import { Loading } from '~/@/result'
import { Img } from '~/@/ui/img'
import { PreloadImg } from '~/@/ui/preload-img'
import { Swiper } from '~/@/ui/swiper'
import { useCurrentScreen } from '../@/screen/use-current-screen'
import { useAppBottomButtons } from '../@/ui/app-bottom-buttons'
import { ScreenLayout } from '../@/ui/screen-layout'
import { useCtx } from '../frontend/ctx'
import { Media } from '../media/media'
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

  const appBottomButtons = useAppBottomButtons()
  return (
    <ScreenLayout topBar={{ title: 'Feed' }} actions={appBottomButtons}>
      <ViewMediaDbQueryOutput feed={feed} />
    </ScreenLayout>
  )
}

const ViewMediaDbQueryOutput = (props: { feed: Feed | null }) => {
  const ctx = useCtx()

  const { feed } = props

  if (!feed) return <ImgLoading />

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
      <SlidesFragment limit={20} offset={0} />
    </Swiper.Container>
  )
}

const SlidesFragment = (props: { limit: number; offset: number }) => {
  const ctx = useCtx()

  const mediaQuery = useSubscription(
    () =>
      ctx.mediaDb.liveQuery({
        limit: props.limit,
        offset: props.offset,
        orderBy: [{ column: 'popularity', direction: 'desc' }],
      }),
    [ctx]
  )
  const media = mediaQuery ?? Loading
  switch (media.t) {
    case 'error':
    case 'loading': {
      return (
        <Swiper.Slide>
          <ImgLoading />
        </Swiper.Slide>
      )
    }
    case 'ok': {
      if (media.value.media.items.length === 0)
        return (
          <Swiper.Slide>
            <ImgLoading />
          </Swiper.Slide>
        )

      return (
        <>
          {media.value.media.items.map((item) => (
            <Swiper.Slide key={item.id}>
              <SlideContent item={item} />
            </Swiper.Slide>
          ))}
        </>
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

const ImgLoading = () => {
  return <Img className="h-full w-full object-cover" alt="Loading..." />
}
