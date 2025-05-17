import { Clickable } from '~/@/ui/clickable'
import { WithPreload } from '~/@/ui/preload'
import { Swiper, SwiperContainerProps } from '~/@/ui/swiper'
import { ScreenFrom } from '~/app/@/screen/screen'
import { useCurrentScreen } from '~/app/@/screen/use-current-screen'
import { useCtx } from '~/app/frontend/ctx'
import { Media } from '../media'
import { MediaPoster } from './media-poster'

export const MediaPosterSwiper = (
  props: Partial<SwiperContainerProps> & {
    media: Media[]
    from: ScreenFrom
  }
) => {
  const currentScreen = useCurrentScreen()
  const ctx = useCtx()
  return (
    <Swiper.Container {...props} slidesPerView="auto" spaceBetween={12} className="w-full">
      {props.media.map((m) => (
        <Swiper.Slide key={m.id} className="w-42">
          <Clickable
            className="w-full"
            onClick={() => {
              currentScreen.push({
                t: 'media-details',
                mediaId: m.id,
                from: props.from,
              })
            }}
          >
            <WithPreload
              preloadKey={m.id}
              onPreload={() => {
                ctx.mediaDb.query({
                  where: { op: '=', column: 'id', value: m.id },
                  limit: 1,
                  offset: 0,
                })
              }}
            >
              <MediaPoster media={m} />
            </WithPreload>
          </Clickable>
        </Swiper.Slide>
      ))}
    </Swiper.Container>
  )
}
