import { useSubscription } from '~/@/pub-sub'
import { isOk } from '~/@/result'
import { Swiper } from '~/@/ui/swiper'
import { useCtx } from '~/app/frontend/ctx'
import { MediaId } from '../../media-id'
import { CreditCard } from './credit-card'
import { cn } from '~/@/ui/cn'

export const CreditsCardSwiper = (props: { mediaId: MediaId }) => {
  const ctx = useCtx()

  const queried = useSubscription(
    () =>
      ctx.creditDb.liveQuery({
        where: {
          op: '=',
          column: 'mediaId',
          value: props.mediaId,
        },
        orderBy: [{ column: 'personId', direction: 'asc' }],
        limit: 500,
        offset: 0,
      }),
    [ctx, props.mediaId]
  )

  if (!queried) return null
  if (!isOk(queried)) return null

  return (
    <Swiper.Container direction="horizontal" className="w-full px-2" slidesPerView={3}>
      {queried.value.entities.items.map((credit, index) => (
        <Swiper.Slide key={credit.id}>
          <div
            className={cn(
              'flex h-full w-full items-center justify-center p-1',
              index === 0 ? 'pl-4' : ''
            )}
          >
            <CreditCard credit={credit} person={queried.value.related.person} />
          </div>
        </Swiper.Slide>
      ))}
    </Swiper.Container>
  )
}
