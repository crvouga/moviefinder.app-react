import { Clickable } from '~/@/ui/clickable'
import { Swiper, SwiperContainerProps } from '~/@/ui/swiper'
import { Video } from './video'
import { VideoId } from './video-id'
import { VideoBlock } from './video-block'

export const VideoSwiper = (props: {
  swiper?: Partial<SwiperContainerProps>
  videos?: Video[]
  onClick?: (input: { videoId: VideoId }) => void
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
      {props.skeleton || (props.videos?.length ?? 0) === 0 ? (
        <>
          {[...Array(6)].map((_, i) => (
            <Swiper.Slide key={i} className="w-fit">
              <VideoBlock skeleton />
            </Swiper.Slide>
          ))}
        </>
      ) : (
        props.videos?.flatMap((video) => {
          return [
            <Swiper.Slide key={video.id} className="w-fit">
              <Clickable
                onClick={() => {
                  props.onClick?.({ videoId: video.id })
                }}
              >
                <VideoBlock video={video} />
              </Clickable>
            </Swiper.Slide>,
          ]
        })
      )}
    </Swiper.Container>
  )
}
