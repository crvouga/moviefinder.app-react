import { Clickable } from '~/@/ui/clickable'
import { WrapIntersectionObserver } from '~/@/ui/intersection-observer'
import { Swiper, SwiperContainerProps } from '~/@/ui/swiper'
import { Media } from './media'
import { MediaId } from './media-id'
import { MediaPoster } from './media-poster'

export const MediaPosterSwiper = (props: {
  swiper?: Partial<SwiperContainerProps>
  media?: Media[]
  onClick?: (input: { mediaId: MediaId }) => void
  onPreload?: (input: { mediaId: MediaId }) => void
  skeleton?: boolean
}) => {
  return (
    <Swiper.Container {...props.swiper} slidesPerView="auto" spaceBetween={12} className="w-full">
      {props.skeleton || (props.media?.length ?? 0) === 0
        ? [...Array(4)].map((_, i) => (
            <SwiperSlide key={i}>
              <Clickable className="w-full">
                <MediaPoster skeleton />
              </Clickable>
            </SwiperSlide>
          ))
        : props.media?.map((m) => (
            <SwiperSlide key={m.id}>
              <WrapIntersectionObserver
                onVisible={() => {
                  props.onPreload?.({ mediaId: m.id })
                }}
              >
                <Clickable
                  className="w-full"
                  onClick={() => {
                    props.onClick?.({ mediaId: m.id })
                  }}
                >
                  <MediaPoster media={m} />
                </Clickable>
              </WrapIntersectionObserver>
            </SwiperSlide>
          ))}
    </Swiper.Container>
  )
}

const SwiperSlide = (props: { children: React.ReactNode }) => {
  return <Swiper.Slide className="w-42">{props.children}</Swiper.Slide>
}
