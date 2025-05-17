import { useSubscription } from '~/@/ui/use-subscription'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../media-id'

export const useMediaDetailsQuery = (props: { mediaId: MediaId | null }) => {
  const ctx = useCtx()

  const queried = useSubscription(['media-query', props.mediaId], () =>
    props.mediaId
      ? ctx.mediaDb.liveQuery({
          where: { op: '=', column: 'id', value: props.mediaId },
          limit: 1,
          offset: 0,
        })
      : null
  )

  const media = queried?.t === 'ok' ? queried.value.entities.items[0] : null

  return {
    media,
    queried,
  }
}
