import { ImageSet } from '~/@/image-set'
import { Img } from '~/@/ui/img'
import { Typography } from '~/@/ui/typography'
import { toThumbnailImageSet } from '~/@/youtube/thumbnail'
import { Video } from './video'

export const VideoBlock = (props: { skeleton?: boolean; video?: Video; onClick?: () => void }) => {
  const imageSet = toThumbnailImageSet({ key: props.video?.key ?? '' })
  return (
    <div className="flex w-full flex-col items-start gap-2 overflow-hidden">
      <Img
        className="aspect-video w-36 rounded-lg shadow-lg"
        src={props.skeleton ? ' ' : ImageSet.toMiddleRes(imageSet)}
      />
      <Typography
        variant="label"
        skeletonLength={9}
        skeleton={props.skeleton}
        text={props.video?.name ?? ''}
      />
      <Typography
        variant="caption"
        skeletonLength={4}
        skeleton={props.skeleton}
        text={props.video?.type ?? ''}
      />
    </div>
  )
}
