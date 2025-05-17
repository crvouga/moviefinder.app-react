import { useSubscription } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { Clickable } from '~/@/ui/clickable'
import { WithPreload } from '~/@/ui/preload'
import { Swiper, SwiperContainerProps } from '~/@/ui/swiper'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../../media-id'
import { CreditCard } from './credit'

export const CreditsCardSwiper = (
  props: Partial<SwiperContainerProps> & { mediaId: MediaId | null }
) => {
  const ctx = useCtx()
  const currentScreen = useCurrentScreen()

  const queried = useSubscription(['credit-query', ctx.clientSessionId, props.mediaId], () =>
    props.mediaId
      ? ctx.creditDb.liveQuery({
          where: {
            op: '=',
            column: 'mediaId',
            value: props.mediaId,
          },
          orderBy: [{ column: 'personId', direction: 'asc' }],
          limit: 25,
          offset: 0,
        })
      : null
  )

  if (!queried) return null
  if (!isOk(queried)) return null

  return (
    <Swiper.Container
      {...props}
      direction="horizontal"
      className="w-full"
      slidesPerView="auto"
      initialSlide={0}
    >
      {queried.value.entities.items.flatMap((credit) => {
        const person = queried.value.related.person[credit.personId]
        if (!person) return []
        return [
          <Swiper.Slide key={credit.id} className="w-fit">
            <Clickable
              onClick={() => {
                const { mediaId } = props
                if (!mediaId) return
                currentScreen.push({
                  t: 'person-details',
                  personId: credit.personId,
                  from: { t: 'media-details', mediaId },
                })
              }}
            >
              <WithPreload
                preloadKey={credit.personId}
                onPreload={() => {
                  ctx.personDb.query({
                    where: { op: '=', column: 'id', value: credit.personId },
                    limit: 1,
                    offset: 0,
                  })
                }}
              >
                <CreditCard credit={credit} person={person} />
              </WithPreload>
            </Clickable>
          </Swiper.Slide>,
        ]
      })}
    </Swiper.Container>
  )
}
