import { isOk } from '~/@/result'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { ScreenFrom } from '~/app/@/screen/screen'
import { useCtx } from '~/app/frontend/ctx'
import { MediaPosterSwiper } from '../../frontend/media-poster-swiper'
import { Media } from '../../media'
import { MediaId } from '../../media-id'
import { RelationshipType } from '../relationship-type'

export const RelationshipTypeMediaPosterSwiper = (
  props: Partial<SwiperContainerProps> & {
    mediaId: MediaId | null
    relationshipType: RelationshipType
    from: ScreenFrom
  }
) => {
  const ctx = useCtx()

  const queried = useSubscription(
    ['relationship-query', props.relationshipType, props.mediaId],
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
      })
  )

  if (!queried) return null

  if (!isOk(queried)) return null

  const media: Media[] = []
  for (const item of queried.value.entities.items) {
    const mediaItem = queried.value.related.media[item.to]
    if (!mediaItem) continue
    media.push(mediaItem)
  }

  return <MediaPosterSwiper {...props} media={media} from={props.from} />
}
