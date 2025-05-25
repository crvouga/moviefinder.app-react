import { ImageSet } from '~/@/image-set'
import { Img } from '~/@/ui/img'
import { Typography } from '~/@/ui/typography'
import { Video } from './video'

export const VideoBlock = (props: { skeleton?: boolean; video?: Video; onClick?: () => void }) => {
  return (
    <div className="flex w-48 flex-col items-start gap-2 truncate">
      <Img
        className="aspect-video w-full overflow-hidden rounded-lg border shadow-lg"
        src={props.skeleton ? ' ' : ImageSet.toMiddleRes(Video.toImageSet(props.video))}
      />
      <div className="flex w-full flex-col items-start gap-1">
        <Typography
          variant="label"
          className="w-full truncate text-left"
          skeletonLength={9}
          skeleton={props.skeleton}
          text={props.video?.name ?? ''}
        />
        <Typography
          className="truncate"
          variant="caption"
          color="secondary"
          skeletonLength={4}
          skeleton={props.skeleton}
          text={props.video?.type ?? ''}
        />
      </div>
    </div>
  )
}
