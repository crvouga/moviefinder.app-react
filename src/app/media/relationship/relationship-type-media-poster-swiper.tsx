import { QueryInput } from '~/@/db/interface/query-input/query-input'
import { isOk } from '~/@/result'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { useCtx } from '~/app/frontend/ctx'
import { MediaPosterSwiper } from '../media/media-poster-swiper'
import { Media } from '../media/media'
import { MediaId } from '../media/media-id'
import { Relationship } from './relationship'
import { RelationshipType } from './relationship-type'

const toQuery = (props: {
  mediaId: MediaId | null
  relationshipType: RelationshipType
}): QueryInput<Relationship> => {
  return {
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
        ...(props.mediaId
          ? [
              {
                column: 'from',
                op: '=',
                value: props.mediaId,
              } as const,
            ]
          : []),
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
  }
}

const View = (props: {
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
    () => (props.query.mediaId ? ctx.relationshipDb.liveQuery(toQuery(props.query)) : null)
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

export const RelationshipTypeMediaPosterSwiper = {
  View,
  toQuery,
}
