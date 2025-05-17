import { ImageSet } from '~/@/image-set'
import { useSubscription } from '~/@/pub-sub'
import { Avatar } from '~/@/ui/avatar'
import { JsonViewer } from '~/@/ui/json-viewer'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../../media-id'
import { PersonId } from '../person-id'

// const SLIDES_OFFSET_BEFORE = 24
// const SLIDES_OFFSET_AFTER = 24

export const PersonDetailsScreen = (props: {
  personId: PersonId
  from: { t: 'media-details'; mediaId: MediaId }
}) => {
  const ctx = useCtx()
  const currentScreen = useCurrentScreen()
  const queried = useSubscription(['person-query', ctx.clientSessionId, props.personId], () =>
    ctx.personDb.liveQuery({
      where: { op: '=', column: 'id', value: props.personId },
      limit: 1,
      offset: 0,
    })
  )

  const person = queried?.t === 'ok' ? queried.value.entities.items[0] : null

  return (
    <ScreenLayout
      includeGutter
      topBar={{
        onBack: () => currentScreen.push(props.from),
        title: person?.name ?? ' ',
      }}
    >
      <div className="flex w-full flex-col items-center justify-start p-6">
        <Avatar src={ImageSet.toHighestRes(person?.profile)} className="size-32" />
        <div className="text-2xl font-bold">{person?.name}</div>
      </div>
      <JsonViewer json={person} />
    </ScreenLayout>
  )
}
