import { QueryInput } from '~/@/db/interface/query-input/query-input'
import { isOk } from '~/@/result'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useLiveQuery } from '~/@/ui/use-live-query'
import { useCtx } from '~/app/frontend/ctx'
import { Media } from '../media/media'
import { MediaId } from '../media/media-id'
import { MediaPosterSwiper } from '../media/media-poster-swiper'
import { Relationship } from './relationship'
import { RelationshipType } from './relationship-type'

const toQuery = ({
  mediaId,
  relationshipType,
}: {
  mediaId: MediaId
  relationshipType: RelationshipType
}): QueryInput<Relationship> => {
  return QueryInput.init<Relationship>({
    limit: 10,
    offset: 0,
    where: {
      op: 'and',
      clauses: [
        {
          column: 'from',
          op: '=',
          value: mediaId,
        },
        {
          column: 'type',
          op: '=',
          value: relationshipType,
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
}

const toQueryKey = (input: {
  mediaId: MediaId | null
  relationshipType: RelationshipType
}): string => {
  return ['relationship-query', input.relationshipType, input.mediaId].join('-')
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

  const { mediaId, relationshipType } = props.query

  const queried = useLiveQuery({
    queryCache: ctx.queryCache,
    queryKey: toQueryKey({ mediaId, relationshipType }),
    queryFn: () =>
      mediaId ? ctx.relationshipDb.liveQuery(toQuery({ mediaId, relationshipType })) : null,
  })

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
  toQueryKey,
}

// @ts-ignore
window.RelationshipTypeMediaPosterSwiper = RelationshipTypeMediaPosterSwiper
