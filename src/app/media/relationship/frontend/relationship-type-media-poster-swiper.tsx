import { isOk } from '~/@/result'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { useCtx } from '~/app/frontend/ctx'
import { MediaPosterSwiper } from '../../media/frontend/media-poster-swiper'
import { Media } from '../../media/media'
import { MediaId } from '../../media/media-id'
import { RelationshipType } from '../relationship-type'

export const RelationshipTypeMediaPosterSwiper = (props: {
  swiper?: Partial<SwiperContainerProps>
  query: {
    mediaId: MediaId | null
    relationshipType: RelationshipType
  }
  onClick: (input: { mediaId: MediaId }) => void
  onPreload: (input: { mediaId: MediaId }) => void
}) => {
  const ctx = useCtx()

  const queried = useSubscription(
    ['relationship-query', props.query.relationshipType, props.query.mediaId],
    () =>
      props.query.mediaId
        ? ctx.relationshipDb.liveQuery({
            limit: 10,
            offset: 0,
            where: {
              op: 'and',
              clauses: [
                {
                  column: 'type',
                  op: '=',
                  value: props.query.relationshipType,
                },
                {
                  column: 'from',
                  op: '=',
                  value: props.query.mediaId,
                },
              ],
            },
            orderBy: [
              {
                column: 'to',
                direction: 'asc',
              },
              {
                column: 'id',
                direction: 'asc',
              },
            ],
          })
        : null
  )

  if (!queried) return <MediaPosterSwiper swiper={props.swiper} skeleton />

  if (!isOk(queried)) return <MediaPosterSwiper swiper={props.swiper} skeleton />

  const media: Media[] = queried.value.entities.items.flatMap((item) => {
    const media = queried.value.related.media[item.to]
    return media ? [media] : []
  })

  return (
    <MediaPosterSwiper
      swiper={props.swiper}
      media={media}
      onClick={props.onClick}
      onPreload={props.onPreload}
    />
  )
}
