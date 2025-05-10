import { useEffect, useState } from 'react'
import { Loading, NotAsked, Remote } from '~/@/result'
import { AppBottomButtonsLayout } from '~/app/@/ui/app-bottom-buttons'
import { useCtx } from '../ctx/frontend'
import { MediaDbQueryOutput } from '../media/media-db/query-output'

export const FeedScreen = () => {
  const ctx = useCtx()

  const [media, setMedia] = useState<Remote | MediaDbQueryOutput>(NotAsked)
  useEffect(() => {
    setMedia(Loading)
    ctx.mediaDb
      .query({
        limit: 20,
        offset: 0,
      })
      .then(setMedia)
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
        <div>
          {props.media.value.media.items.map((item) => (
            <div key={item.id}>{item.title}</div>
          ))}
        </div>
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
