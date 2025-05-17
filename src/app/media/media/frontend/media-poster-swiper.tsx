import { Clickable } from '~/@/ui/clickable'
import { Swiper, SwiperContainerProps } from '~/@/ui/swiper'
import { Media } from '../media'
import { MediaId } from '../media-id'
import { MediaPoster, MediaPosterSkeleton } from './media-poster'

export const MediaPosterSwiper = (props: {
  swiper?: Partial<SwiperContainerProps>
  media?: Media[]
  onClick?: (input: { mediaId: MediaId }) => void
  skeleton?: boolean
}) => {
  return (
    <Swiper.Container {...props.swiper} slidesPerView="auto" spaceBetween={12} className="w-full">
      {props.skeleton || (props.media?.length ?? 0) === 0
        ? [...Array(4)].map((_, i) => (
            <Swiper.Slide key={i} className="w-42">
              <MediaPosterSkeleton />
            </Swiper.Slide>
          ))
        : props.media?.map((m) => (
            <Swiper.Slide key={m.id} className="w-42">
              <Clickable
                className="w-full"
                onClick={() => {
                  props.onClick?.({ mediaId: m.id })
                }}
              >
                <MediaPoster media={m} />
              </Clickable>
            </Swiper.Slide>
          ))}
    </Swiper.Container>
  )
}
