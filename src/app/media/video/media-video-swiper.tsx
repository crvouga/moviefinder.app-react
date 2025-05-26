import { QueryInput } from '~/@/db/interface/query-input/query-input'
import { isOk } from '~/@/result'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../media/media-id'
import { Video } from './video'
import { VideoSwiper } from './video-swiper'

const View = (props: {
  swiper?: Partial<SwiperContainerProps>
  mediaId: MediaId | null
  onClick: (input: { video: Video }) => void
}) => {
  const ctx = useCtx()

  const queried = useSubscription({
    subCache: ctx.subCache,
    subKey: toQueryKey({ mediaId: props.mediaId }),
    subFn: () =>
      props.mediaId ? ctx.videoDb.liveQuery(toQuery({ mediaId: props.mediaId })) : null,
  })

  if (!queried) return <VideoSwiper swiper={props.swiper} skeleton />

  if (!isOk(queried)) return <VideoSwiper swiper={props.swiper} skeleton />

  return (
    <VideoSwiper
      swiper={props.swiper}
      videos={queried.value.entities.items}
      onClick={props.onClick}
    />
  )
}

const toQuery = (input: { mediaId: MediaId }): QueryInput<Video> => {
  return QueryInput.init<Video>({
    where: {
      op: '=',
      column: 'mediaId',
      value: input.mediaId,
    },
    orderBy: [
      {
        column: 'order',
        direction: 'desc',
      },
    ],
    limit: 10,
    offset: 0,
  })
}

const toQueryKey = (input: { mediaId: MediaId | null }): string => {
  return ['video-query', input.mediaId].join('-')
}

export const MediaVideoSwiper = {
  View,
  toQuery,
  toQueryKey,
}
