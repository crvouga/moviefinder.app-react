import { Clickable } from '~/@/ui/clickable'
import { Swiper, SwiperContainerProps } from '~/@/ui/swiper'
import { Person } from '../../person/person'
import { PersonId } from '../../person/person-id'
import { Credit } from '../credit'
import { CreditCard, CreditCardSkeleton } from './credit'

export const CreditsSwiper = (
  props: Partial<SwiperContainerProps> & {
    credits?: Credit[]
    person?: { [personId: PersonId]: Person }
    onClick?: (input: { personId: PersonId }) => void
    skeleton?: boolean
  }
) => {
  return (
    <Swiper.Container
      {...props}
      direction="horizontal"
      className="w-full"
      slidesPerView="auto"
      initialSlide={0}
    >
      {props.credits?.flatMap((credit) => {
        const person = props.person?.[credit.personId]
        if (!person) return []
        return [
          <Swiper.Slide key={credit.id} className="w-fit">
            <Clickable
              onClick={() => {
                props.onClick?.({ personId: credit.personId })
              }}
            >
              <CreditCard credit={credit} person={person} />
            </Clickable>
          </Swiper.Slide>,
        ]
      })}
      {props.skeleton && (
        <>
          {[...Array(4)].map((_, i) => (
            <Swiper.Slide key={i} className="w-fit">
              <CreditCardSkeleton />
            </Swiper.Slide>
          ))}
        </>
      )}
    </Swiper.Container>
  )
}
