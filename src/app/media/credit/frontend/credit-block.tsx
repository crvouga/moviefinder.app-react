import { ImageSet } from '~/@/image-set'
import { Avatar } from '~/@/ui/avatar'
import { Person } from '../../person/person'
import { Credit } from '../credit'

export const CreditBlock = (props: {
  skeleton?: boolean
  credit?: Credit
  person?: Person
  onClick?: () => void
}) => {
  return (
    <div
      className="flex h-full w-24 flex-col items-center justify-start rounded-lg pr-2"
      style={{
        overflow: 'hidden',
        height: '200px',
      }}
    >
      <Avatar
        className="size-24 rounded-full border"
        src={ImageSet.toMiddleRes(props.person?.profile)}
        skeleton={props.skeleton}
      />

      <p className="text-center text-sm font-bold">{props.person?.name}</p>

      {props.skeleton && (
        <p className="h-4 w-full animate-pulse rounded-full bg-neutral-700 text-center text-sm font-bold" />
      )}

      {props.skeleton && (
        <p className="h-4 w-full animate-pulse rounded-full bg-neutral-700 text-center text-xs text-neutral-400" />
      )}

      {props.credit?.job && (
        <p className="text-center text-xs text-neutral-400">{props.credit.job}</p>
      )}

      {props.credit?.character && (
        <p className="text-center text-xs text-neutral-400">{props.credit.character}</p>
      )}
    </div>
  )
}
