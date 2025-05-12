import { ImageSet } from '~/@/image-set'
import { useLatestValue } from '~/@/pub-sub'
import { NotAsked } from '~/@/result'
import { Img } from '~/@/ui/image'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { useCtx } from '~/app/frontend/ctx'
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
  const media = queried.t === 'ok' ? queried.value.media.items[0] : null

  return (
    <ScreenLayout
      topBar={{
        onBack: () => currentScreen.push({ type: 'feed' }),
        title: media?.title ?? '...',
      }}
      actions={[]}
    >
      <Img
        className="aspect-video w-full object-cover"
        src={ImageSet.toHighestRes(media?.backdrop)}
        alt={media?.title ?? ' '}
      />
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-center text-3xl font-bold">{media?.title ?? '...'}</p>
        {media?.description && <p className="text-center">{media?.description}</p>}
      </div>
    </ScreenLayout>
  )
}
