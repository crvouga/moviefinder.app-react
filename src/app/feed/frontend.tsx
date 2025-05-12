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

export const FeedScreen = () => {
  const ctx = useCtx()

  const media = useSubscription(
    () =>
      ctx.mediaDb.liveQuery({
        limit: 20,
        offset: 0,
        orderBy: [
          {
            column: 'popularity',
            direction: 'desc',
          },
        ],
      }),
    [ctx]
  )

  const appBottomButtons = useAppBottomButtons()
  return (
    <ScreenLayout topBar={{ title: 'Feed' }} actions={appBottomButtons}>
      <ViewMediaDbQueryOutput media={media ?? NotAsked} />
    </ScreenLayout>
  )
}

const ViewMediaDbQueryOutput = (props: { media: Remote | MediaDbQueryOutput }) => {
  const currentScreen = useCurrentScreen()
  switch (props.media.t) {
    case 'not-asked':
    case 'loading': {
      return <Img className="h-full w-full object-cover" alt="Loading..." />
    }
    case 'error': {
      return <div>Error</div>
    }
    case 'ok': {
      if (props.media.value.media.items.length === 0) {
        return <Img className="h-full w-full object-cover" alt="Loading..." />
      }
      return (
        <Swiper.Container
          initialSlide={2}
          slidesPerView={1}
          className="h-full w-full"
          direction="vertical"
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
