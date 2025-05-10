import { useEffect, useState } from 'react'
import { Loading, NotAsked, Remote } from '~/@/result'
import { Swiper } from '~/@/ui/swiper'
import { AppBottomButtonsLayout } from '~/app/@/ui/app-bottom-buttons'
import { useCtx } from '../ctx/frontend'
import { MediaDbQueryOutput } from '../media/media-db/query-output'

export const FeedScreen = () => {
  const ctx = useCtx()
  const [media, setMedia] = useState<Remote | MediaDbQueryOutput>(NotAsked)
  useEffect(() => {
    setMedia(Loading)
    ctx.mediaDb.query({ limit: 20, offset: 0 }).then(setMedia)
  }, [])

  return (
    <AppBottomButtonsLayout>
      <ViewMediaDbQueryOutput media={media} />
    </AppBottomButtonsLayout>
  )
}

const ViewMediaDbQueryOutput = (props: { media: Remote | MediaDbQueryOutput }) => {
  switch (props.media.t) {
    case 'ok': {
      return (
        <Swiper.Container slidesPerView={1} className="h-full w-full" direction="vertical">
          {props.media.value.media.items.map((item) => (
            <Swiper.Slide key={item.id}>{item.title}</Swiper.Slide>
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
