import { ImageSet } from '~/@/image-set'
import { Img } from '~/@/ui/img'
import { Media } from '../media'

export const MediaPoster = (props: { media: Media }) => {
  return (
    <Img
      className="w-full overflow-hidden rounded-lg border object-cover"
      src={ImageSet.toHighestRes(props.media.poster)}
      alt={props.media.title ?? ' '}
    />
  )
}
