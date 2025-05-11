import { ImageSet } from '~/@/image-set'
import { useLatest } from '~/@/pub-sub'
import { NotAsked, Remote } from '~/@/result'
import { Swiper } from '~/@/ui/swiper'
import { AppBottomButtonsLayout } from '~/app/@/ui/app-bottom-buttons'
import { useCtx } from '../ctx/frontend'
import { MediaDbQueryOutput } from '../media/media-db/interface/query-output'
import { useCallback } from 'react'

export const FeedScreen = () => {
  const ctx = useCtx()

  const liveQuery = useCallback(() => ctx.mediaDb.liveQuery({ limit: 20, offset: 0 }), [ctx])

  const queried = useLatest<Remote | MediaDbQueryOutput>(liveQuery, NotAsked)

  return (
    <AppBottomButtonsLayout>
      <ViewMediaDbQueryOutput media={queried} />
    </AppBottomButtonsLayout>
  )
}

const ViewMediaDbQueryOutput = (props: { media: Remote | MediaDbQueryOutput }) => {
  switch (props.media.t) {
    case 'ok': {
      return (
        <Swiper.Container slidesPerView={1} className="h-full w-full" direction="vertical">
          {props.media.value.media.items.map((item) => (
            <Swiper.Slide key={item.id}>
              <img
                className="h-full w-full object-cover"
                src={ImageSet.toHighestRes(item.poster) ?? ''}
                alt={item.title}
              />
            </Swiper.Slide>
          ))}
        </Swiper.Container>
      )
    }
    case 'not-asked': {
      return <div>NotAsked</div>
    }
    case 'loading': {
      return <div>Loading</div>
    }
    case 'error': {
      return <div>Error</div>
    }
  }
}
