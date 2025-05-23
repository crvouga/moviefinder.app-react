import { ImageSet } from '~/@/image-set'
import { Img } from '~/@/ui/img'
import { Media } from './media'

export const MediaPoster = (props: { media?: Media; skeleton?: boolean }) => {
  return (
    <Img
      className="border-box w-full overflow-hidden rounded-lg border object-cover"
      style={{ aspectRatio: 2 / 3 }}
      src={props.skeleton ? ' ' : ImageSet.toMiddleRes(props.media?.poster || undefined)}
      alt={props.skeleton ? ' ' : (props.media?.title ?? ' ')}
    />
  )
}
