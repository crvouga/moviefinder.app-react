import { Swiper } from '~/@/ui/swiper'
import { Media } from '../media'
import { MediaPoster } from './media-poster'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { Clickable } from '~/@/ui/clickable'

export const MediaPosterSwiper = (props: { media: Media[] }) => {
  const currentScreen = useCurrentScreen()
  return (
    <Swiper.Container slidesPerView="auto" spaceBetween={10} className="w-full">
      {props.media.map((m) => (
        <Swiper.Slide key={m.id} className="w-40">
          <Clickable
            className="w-full"
            onClick={() => {
              currentScreen.push({ t: 'media-details', mediaId: m.id })
            }}
          >
            <MediaPoster media={m} />
          </Clickable>
        </Swiper.Slide>
      ))}
    </Swiper.Container>
  )
}
