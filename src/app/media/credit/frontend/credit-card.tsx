import { ImageSet } from '~/@/image-set'
import { Avatar } from '~/@/ui/avatar'
import { Person } from '../../person/person'
import { PersonId } from '../../person/person-id'
import { Credit } from '../credit'

export const CreditCard = (props: { credit: Credit; person: { [personId: PersonId]: Person } }) => {
  const person = props.person[props.credit.personId]
  if (!person) return null
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-neutral-900 p-2">
      <Avatar className="size-24 rounded-full" src={ImageSet.toHighestRes(person.profile)} />
      <p className="text-sm font-bold">{person.name}</p>
      <p className="text-sm text-neutral-400">{props.credit.job}</p>
      <p className="text-sm text-neutral-400">{props.credit.character}</p>
    </div>
  )
}
