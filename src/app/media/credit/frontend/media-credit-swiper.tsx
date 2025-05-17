import { isOk } from '~/@/result'
import { SwiperContainerProps } from '~/@/ui/swiper'
import { useSubscription } from '~/@/ui/use-subscription'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../../media/media-id'
import { PersonId } from '../../person/person-id'
import { CreditId } from '../credit-id'
import { CreditsSwiper } from './credit-swiper'

export const MediaCreditsSwiper = (props: {
  swiper?: Partial<SwiperContainerProps>
  mediaId: MediaId | null
  onClick: (input: { personId: PersonId; creditId: CreditId }) => void
}) => {
  const ctx = useCtx()
  const currentScreen = useCurrentScreen()

  const queried = useSubscription(['credit-query', props.mediaId], () =>
    props.mediaId
      ? ctx.creditDb.liveQuery({
          where: {
            op: 'and',
            clauses: [
              {
                op: '=',
                column: 'mediaId',
                value: props.mediaId,
              },
            ],
          },
          orderBy: [
            {
              column: 'order',
              direction: 'desc',
            },
          ],
          limit: 10,
          offset: 0,
        })
      : null
  )

  if (!queried) return <CreditsSwiper swiper={props.swiper} skeleton />

  if (!isOk(queried)) return <CreditsSwiper swiper={props.swiper} skeleton />

  return (
    <CreditsSwiper
      swiper={props.swiper}
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
