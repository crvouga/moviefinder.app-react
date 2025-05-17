import { ImageSet } from '~/@/image-set'
import { Img } from '~/@/ui/img'
import { Media } from '../media'

const ASPECT_RATIO = 2 / 3

export const MediaPoster = (props: { media: Media }) => {
  return (
    <Img
      className="w-full overflow-hidden rounded-lg border object-cover"
      style={{ aspectRatio: ASPECT_RATIO }}
      src={ImageSet.toMiddleRes(props.media.poster)}
      alt={props.media.title ?? ' '}
    />
  )
}
export const MediaPosterSkeleton = () => {
  return (
    <Img
      className="w-full overflow-hidden rounded-lg border object-cover"
      style={{ aspectRatio: ASPECT_RATIO }}
      src=" "
      alt=" "
    />
  )
}
