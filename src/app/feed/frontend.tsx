import { ImageSet } from '~/@/image-set'
import { useLatestValue } from '~/@/pub-sub'
import { NotAsked, Remote } from '~/@/result'
import { SpinnerBlock } from '~/@/ui/spinner'
import { Swiper } from '~/@/ui/swiper'
import { AppBottomButtonsLayout } from '~/app/@/ui/app-bottom-buttons'
import { useCtx } from '../ctx/frontend'
import { MediaDbQueryOutput } from '../media/media-db/interface/query-output'
import { useCurrentScreen } from '../@/screen/use-current-screen'

export const FeedScreen = () => {
  const ctx = useCtx()

  const queried = useLatestValue(
    //
    NotAsked,
    () => ctx.mediaDb.liveQuery({ limit: 20, offset: 0 }),
    [ctx]
  )

  return (
    <AppBottomButtonsLayout>
      <ViewMediaDbQueryOutput media={queried} />
    </AppBottomButtonsLayout>
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
                className="h-full w-full"
                onClick={() => currentScreen.push({ type: 'media-details', mediaId: item.id })}
              >
                <img
                  className="h-full w-full object-cover"
                  src={ImageSet.toHighestRes(item.poster) ?? ''}
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
