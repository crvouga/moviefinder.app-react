import { Clickable } from '~/@/ui/clickable'
import { WrapIntersectionObserver } from '~/@/ui/intersection-observer'
import { Swiper } from '~/@/ui/swiper'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { useCtx } from '~/app/frontend/ctx'
import { Media } from '../media'
import { MediaPoster } from './media-poster'

export const MediaPosterSwiper = (props: { media: Media[] }) => {
  const currentScreen = useCurrentScreen()
  const ctx = useCtx()
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
            <WrapIntersectionObserver
              onVisible={() => {
                ctx.mediaDb.query({
                  where: { op: '=', column: 'id', value: m.id },
                  limit: 1,
                  offset: 0,
                })
              }}
            >
              <MediaPoster media={m} />
            </WrapIntersectionObserver>
          </Clickable>
        </Swiper.Slide>
      ))}
    </Swiper.Container>
  )
}
