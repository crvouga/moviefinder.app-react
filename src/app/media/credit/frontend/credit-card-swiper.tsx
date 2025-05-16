import { useSubscription } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { cn } from '~/@/ui/cn'
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
      ctx.creditDb.liveQuery({
        where: {
          op: '=',
          column: 'mediaId',
          value: props.mediaId ?? '',
        },
        orderBy: [{ column: 'personId', direction: 'asc' }],
        limit: 25,
        offset: 0,
      }),
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
      {queried.value.entities.items.flatMap((credit, index) => {
        const person = queried.value.related.person[credit.personId]
        if (!person) return []
        return [
          <Swiper.Slide key={credit.id} className="w-fit">
            <div
              className={cn('flex h-full items-center justify-center', index === 0 ? 'pl-4' : '')}
            >
              <CreditCard credit={credit} person={person} />
            </div>
          </Swiper.Slide>,
        ]
      })}
    </Swiper.Container>
  )
}
