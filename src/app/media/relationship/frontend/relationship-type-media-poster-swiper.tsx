import { useSubscription } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useCtx } from '~/app/frontend/ctx'
import { MediaPosterSwiper } from '../../frontend/media-poster-swiper'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { RelationshipType } from '../relationship-type'

export const RelationshipTypeMediaPosterSwiper = (
  props: Partial<SwiperContainerProps> & {
    mediaId: MediaId | null
    relationshipType: RelationshipType
  }
) => {
  const ctx = useCtx()

  const queried = useSubscription(
    () =>
      ctx.relationshipDb.liveQuery({
        limit: 10,
        offset: 0,
        where: {
          op: 'and',
          clauses: [
            {
              column: 'type',
              op: '=',
              value: props.relationshipType,
            },
            {
              column: 'from',
              op: '=',
              value: props.mediaId ?? '',
            },
          ],
        },
        orderBy: [
          {
            column: 'to',
            direction: 'asc',
          },
        ],
      }),
    [ctx, props.mediaId]
  )

  if (!queried) return null

  if (!isOk(queried)) return null

  const media: Media[] = []
  for (const item of queried.value.entities.items) {
    const mediaItem = queried.value.related.media[item.to]
    if (!mediaItem) continue
    media.push(mediaItem)
  }

  return <MediaPosterSwiper {...props} media={media} />
}
