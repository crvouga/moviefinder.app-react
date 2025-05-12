import { useLatestValue } from '~/@/pub-sub'
import { NotAsked } from '~/@/result'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { useCtx } from '~/app/ctx/frontend'
import { MediaId } from '../media-id'

export const MediaDetailsScreen = (props: { mediaId: MediaId }) => {
  const ctx = useCtx()

  const queried = useLatestValue(
    NotAsked,
    () =>
      ctx.mediaDb.liveQuery({
        where: { op: '=', column: 'id', value: props.mediaId },
        limit: 1,
        offset: 0,
      }),
    [ctx, props.mediaId]
  )

  const currentScreen = useCurrentScreen()

  return (
    <ScreenLayout
      topBar={{
        onBack: () => currentScreen.push({ type: 'feed' }),
        title: queried.t === 'ok' ? (queried.value.media.items[0]?.title ?? '...') : '...',
      }}
      actions={[]}
    >
      <div></div>
    </ScreenLayout>
  )
}
