import { ImageSet } from '~/@/image-set'
import { Avatar } from '~/@/ui/avatar'
import { Typography } from '~/@/ui/typography'
import { Person } from '../../person/person'
import { Credit } from '../credit'

export const CreditBlock = (props: {
  skeleton?: boolean
  credit?: Credit
  person?: Person | null
  onClick?: () => void
}) => {
  return (
    <div
      className="flex h-full w-24 flex-col items-center justify-start gap-1 rounded-lg"
      style={{
        overflow: 'hidden',
        height: '160px',
      }}
    >
      <Avatar
        className="size-24 rounded-full border"
        src={ImageSet.toHighestRes(props.person?.profile)}
        skeleton={props.skeleton}
      />

      <Typography
        variant="label"
        skeletonLength={5}
        skeleton={props.skeleton}
        text={props.person?.name ?? ''}
      />

      {props.skeleton && <Typography color="secondary" variant="caption" skeleton />}

      {props.credit?.job && (
        <Typography
          color="secondary"
          variant="caption"
          skeleton={props.skeleton}
          text={props.credit?.job ?? ''}
        />
      )}

      {props.credit?.character && (
        <Typography
          color="secondary"
          variant="caption"
          skeleton={props.skeleton}
          text={props.credit?.character ?? ''}
        />
      )}
    </div>
  )
}
