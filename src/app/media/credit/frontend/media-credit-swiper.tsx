import { isOk } from '~/@/result'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../../media-id'
import { CreditsSwiper } from './credit-swiper'

export const MediaCreditsSwiper = (
  props: Partial<SwiperContainerProps> & { mediaId: MediaId | null }
) => {
  const ctx = useCtx()
  const currentScreen = useCurrentScreen()

  const queried = useSubscription(['credit-query', props.mediaId], () =>
    props.mediaId
      ? ctx.creditDb.liveQuery({
          where: {
            op: '=',
            column: 'mediaId',
            value: props.mediaId,
          },
          orderBy: [{ column: 'order', direction: 'asc' }],
          limit: 10,
          offset: 0,
        })
      : null
  )

  if (!queried) return <CreditsSwiper {...props} skeleton />
  if (!isOk(queried)) return <CreditsSwiper {...props} skeleton />

  return (
    <CreditsSwiper
      {...props}
      credits={queried.value.entities.items}
      person={queried.value.related.person}
      onClick={(input) => {
        currentScreen.push({
          t: 'person-details',
          personId: input.personId,
          from: props.mediaId ? { t: 'media-details', mediaId: props.mediaId } : { t: 'feed' },
        })
      }}
    />
  )
}
