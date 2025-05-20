import { ImageSet } from '~/@/image-set'
import { CollapsibleArea } from '~/@/ui/collapsible-area'
import { Img } from '~/@/ui/img'
import { Typography } from '~/@/ui/typography'
import { Media } from '../media'

export const MainSection = (props: { media: Media | null }) => {
  return (
    <section className="flex w-full flex-col items-center justify-start">
      <Img
        className="aspect-video w-full object-cover"
        src={ImageSet.toHighestRes(props.media?.backdrop)}
        alt={props.media?.title ?? ' '}
      />
      <CollapsibleArea collapsiedHeight={200} className="flex flex-col items-center gap-3 p-6">
        <Typography
          variant="h2"
          text={props.media?.title ?? ' '}
          skeletonLength={20}
          skeleton={!Boolean(props.media?.title)}
          className="text-center"
        />
        <Typography
          variant="p"
          text={props.media?.description ?? ' '}
          skeletonLength={500}
          skeleton={!Boolean(props.media?.description)}
          className="max-w-lg text-center text-base"
        />
      </CollapsibleArea>
    </section>
  )
}
