import { useSubscription } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { useCtx } from '~/app/frontend/ctx'
import { MediaPosterSwiper } from '../../frontend/media-poster-swiper'
import { Media } from '../../media'
import { MediaId } from '../../media-id'

export const RecommendationMediaPosterSwiper = (props: { mediaId: MediaId }) => {
  const ctx = useCtx()
  const queried = useSubscription(
    () =>
      ctx.relationshipDb.liveQuery({
        limit: 10,
        offset: 0,
        where: { column: 'from', op: '=', value: props.mediaId },
        orderBy: [{ column: 'id', direction: 'asc' }],
      }),
    [ctx, props.mediaId]
  )

  if (!queried) return null
  if (!isOk(queried)) return null

  const media: Media[] = queried.value.entities.items
    .map((item) => item.to)
    .flatMap((mediaId) => {
      const media = queried.value.related.media[mediaId]
      if (!media) return []
      return [media]
    })

  return <MediaPosterSwiper media={media} />
}
