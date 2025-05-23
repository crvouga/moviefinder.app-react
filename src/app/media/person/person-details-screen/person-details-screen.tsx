import { ImageSet } from '~/@/image-set'
import { Avatar } from '~/@/ui/avatar'
import { useSubscription } from '~/@/ui/use-subscription'
import { ScreenFrom } from '~/app/@/screen/current-screen-types'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { ScreenLayout } from '~/app/@/ui/screen-layout'
import { useCtx } from '~/app/frontend/ctx'
import { PersonId } from '../person-id'

export const PersonDetailsScreen = (props: { personId: PersonId | null; from: ScreenFrom }) => {
  const ctx = useCtx()
  const currentScreen = useCurrentScreen()
  const queried = useSubscription(['person-query', ctx.clientSessionId, props.personId], () =>
    props.personId
      ? ctx.personDb.liveQuery({
          where: { op: '=', column: 'id', value: props.personId },
          limit: 1,
          offset: 0,
        })
      : null
  )

  const person = queried?.t === 'ok' ? queried.value.entities.items[0] : null

  return (
    <ScreenLayout
      scrollKey="person-details"
      includeGutter
      topBar={{
        onBack: () => currentScreen.push(props.from),
        title: person?.name ?? ' ',
      }}
    >
      <div className="flex w-full flex-col items-center justify-start p-6">
        <Avatar src={ImageSet.toMiddleRes(person?.profile)} className="size-32" />
        <div className="text-2xl font-bold">{person?.name}</div>
      </div>
    </ScreenLayout>
  )
}
