import { ImageSet } from '~/@/image-set'
import { useLatestValue } from '~/@/pub-sub'
import { NotAsked, Remote } from '~/@/result'
import { SpinnerBlock } from '~/@/ui/spinner'
import { Swiper } from '~/@/ui/swiper'

import { useCurrentScreen } from '../@/screen/use-current-screen'
import { useAppBottomButtons } from '../@/ui/app-bottom-buttons'
import { ScreenLayout } from '../@/ui/screen-layout'
import { useCtx } from '../ctx/frontend'
import { MediaDbQueryOutput } from '../media/media-db/interface/query-output'

export const FeedScreen = () => {
  const ctx = useCtx()

  const queried = useLatestValue(
    //
    NotAsked,
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
      <ViewMediaDbQueryOutput media={queried} />
    </ScreenLayout>
  )
}

const ViewMediaDbQueryOutput = (props: { media: Remote | MediaDbQueryOutput }) => {
  const currentScreen = useCurrentScreen()
  switch (props.media.t) {
    case 'ok': {
      return (
        <Swiper.Container slidesPerView={1} className="h-full w-full" direction="vertical">
          {props.media.value.media.items.map((item) => (
            <Swiper.Slide key={item.id}>
              <button
                className="h-full w-full cursor-pointer"
                onClick={() => currentScreen.push({ type: 'media-details', mediaId: item.id })}
              >
                <img
                  className="h-full w-full object-cover"
                  src={ImageSet.toHighestRes(item.poster)}
                  alt={item.title}
                />
              </button>
            </Swiper.Slide>
          ))}
        </Swiper.Container>
      )
    }
    case 'not-asked': {
      return <SpinnerBlock />
    }
    case 'loading': {
      return <SpinnerBlock />
    }
    case 'error': {
      return <div>Error</div>
    }
  }
}
