import { QueryInput } from '~/@/db/interface/query-input/query-input'
import { isOk } from '~/@/result'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../media/media-id'
import { Video } from './video'
import { VideoId } from './video-id'
import { VideoSwiper } from './video-swiper'

const View = (props: {
  swiper?: Partial<SwiperContainerProps>
  mediaId: MediaId | null
  onClick: (input: { videoId: VideoId }) => void
}) => {
  const ctx = useCtx()

  const queried = useSubscription(['video-query', props.mediaId], () =>
    props.mediaId ? ctx.videoDb.liveQuery(toQuery({ mediaId: props.mediaId })) : null
  )

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
  return {
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
  }
}

export const MediaVideoSwiper = {
  View,
  toQuery,
}
