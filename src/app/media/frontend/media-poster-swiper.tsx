import { Swiper } from '~/@/ui/swiper'
import { Media } from '../media'
import { MediaPoster } from './media-poster'

export const MediaPosterSwiper = (props: { media: Media[] }) => {
  return (
    <Swiper.Container slidesPerView="auto" spaceBetween={10} className="w-full">
      {props.media.map((m) => (
        <Swiper.Slide key={m.id} className="w-40">
          <MediaPoster media={m} />
        </Swiper.Slide>
      ))}
    </Swiper.Container>
  )
}
