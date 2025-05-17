import { ImageSet } from '~/@/image-set'
import { Img } from '~/@/ui/img'
import { Media } from '../media'

const ASPECT_RATIO = 2 / 3

export const MediaPoster = (props: { media?: Media; skeleton?: boolean }) => {
  if (props.skeleton || !props.media) {
    return (
      <Img
        className="w-full overflow-hidden rounded-lg border object-cover"
        style={{ aspectRatio: ASPECT_RATIO }}
        src=" "
        alt=" "
      />
    )
  }

  return (
    <Img
      className="w-full overflow-hidden rounded-lg border object-cover"
      style={{ aspectRatio: ASPECT_RATIO }}
      src={ImageSet.toMiddleRes(props.media.poster)}
      alt={props.media.title ?? ' '}
    />
  )
}
