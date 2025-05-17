import { Clickable } from '~/@/ui/clickable'
import { Swiper, SwiperContainerProps } from '~/@/ui/swiper'
import { ScreenFrom } from '~/app/@/screen/screen'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { Media } from '../media'
import { MediaPoster, MediaPosterSkeleton } from './media-poster'

export const MediaPosterSwiper = (
  props: Partial<SwiperContainerProps> & {
    media: Media[]
    from: ScreenFrom
  }
) => {
  const currentScreen = useCurrentScreen()
  return (
    <Swiper.Container {...props} slidesPerView="auto" spaceBetween={12} className="w-full">
      {props.media?.map((m) => (
        <Swiper.Slide key={m.id} className="w-42">
          <Clickable
            className="w-full"
            onClick={() => {
              currentScreen.push({ t: 'media-details', mediaId: m.id, from: props.from })
            }}
          >
            <MediaPoster media={m} />
          </Clickable>
        </Swiper.Slide>
      ))}
    </Swiper.Container>
  )
}

export const MediaPosterSwiperSkeleton = (props: Partial<SwiperContainerProps>) => {
  return (
    <Swiper.Container {...props} slidesPerView="auto" spaceBetween={12} className="w-full">
      {[...Array(4)].map((_, i) => (
        <Swiper.Slide key={i} className="w-42">
          <MediaPosterSkeleton />
        </Swiper.Slide>
      ))}
    </Swiper.Container>
  )
}
