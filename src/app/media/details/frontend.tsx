import { useLatestValue } from '~/@/pub-sub'
import { NotAsked } from '~/@/result'
import { useCtx } from '~/app/ctx/frontend'
import { MediaId } from '../media-id'

export const MediaDetailsScreen = (props: { mediaId?: MediaId }) => {
  const ctx = useCtx()

  const queried = useLatestValue(
    NotAsked,
    () =>
      ctx.mediaDb.liveQuery({
        // where: { op: '=', column: 'id', value: props.mediaId },
        limit: 1,
        offset: 0,
      }),
    [ctx, props.mediaId]
  )

  console.log(queried)

  return <div>MediaDetailsScreen</div>
}
