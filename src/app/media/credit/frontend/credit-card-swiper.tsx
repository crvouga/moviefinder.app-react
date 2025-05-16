import { useSubscription } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { Clickable } from '~/@/ui/clickable'
import { Swiper, SwiperContainerProps } from '~/@/ui/swiper'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../../media-id'
import { CreditCard } from './credit-card'

export const CreditsCardSwiper = (
  props: Partial<SwiperContainerProps> & { mediaId: MediaId | null }
) => {
  const ctx = useCtx()

  const queried = useSubscription(
    () =>
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
        : null,
    [ctx, props.mediaId]
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
            <Clickable onClick={() => {}}>
              <CreditCard credit={credit} person={person} />
            </Clickable>
          </Swiper.Slide>,
        ]
      })}
    </Swiper.Container>
  )
}
