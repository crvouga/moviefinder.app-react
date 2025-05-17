import { ImageSet } from '~/@/image-set'
import { Avatar } from '~/@/ui/avatar'
import { Person } from '../../person/person'
import { Credit } from '../credit'

export const CreditCard = (props: { credit: Credit; person: Person }) => {
  return (
    <div className="flex h-full w-32 flex-col items-center justify-start gap-2 rounded-lg">
      <Avatar
        className="size-24 rounded-full border"
        src={ImageSet.toHighestRes(props.person.profile)}
      />

      <p className="text-center text-sm font-bold">{props.person.name}</p>

      {props.credit.job && (
        <p className="text-center text-xs text-neutral-400">{props.credit.job}</p>
      )}

      {props.credit.character && (
        <p className="text-center text-xs text-neutral-400">{props.credit.character}</p>
      )}
    </div>
  )
}

export const CreditCardSkeleton = () => {
  return (
    <div className="flex h-full w-32 flex-col items-center justify-start gap-2 rounded-lg">
      <Avatar className="size-24 rounded-full border" skeleton />

      <p className="h-4 w-24 animate-pulse rounded-full bg-neutral-700 text-center text-sm font-bold" />

      <p className="h-4 w-24 animate-pulse rounded-full bg-neutral-700 text-center text-xs text-neutral-400" />
    </div>
  )
}
