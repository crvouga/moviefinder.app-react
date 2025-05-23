import { Clickable } from '~/@/ui/clickable'
import { Swiper, SwiperContainerProps } from '~/@/ui/swiper'
import { Person } from '../person/person'
import { PersonId } from '../person/person-id'
import { Credit } from './credit'
import { CreditId } from './credit-id'
import { CreditBlock } from './credit-block'

export const CreditsSwiper = (props: {
  swiper?: Partial<SwiperContainerProps>
  credits?: Credit[]
  person?: { [personId: PersonId]: Person }
  onClick?: (input: { personId: PersonId; creditId: CreditId }) => void
  skeleton?: boolean
}) => {
  return (
    <Swiper.Container
      {...props.swiper}
      direction="horizontal"
      className="w-full"
      slidesPerView="auto"
      initialSlide={0}
      spaceBetween={12}
    >
      {props.skeleton || (props.credits?.length ?? 0) === 0 ? (
        <>
          {[...Array(6)].map((_, i) => (
            <Swiper.Slide key={i} className="w-fit">
              <CreditBlock skeleton />
            </Swiper.Slide>
          ))}
        </>
      ) : (
        props.credits?.flatMap((credit) => {
          return [
            <Swiper.Slide key={credit.id} className="w-fit">
              <Clickable
                onClick={() => {
                  props.onClick?.({ personId: credit.personId, creditId: credit.id })
                }}
              >
                <CreditBlock credit={credit} person={props.person?.[credit.personId] ?? null} />
              </Clickable>
            </Swiper.Slide>,
          ]
        })
      )}
    </Swiper.Container>
  )
}
