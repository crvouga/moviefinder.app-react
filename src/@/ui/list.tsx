import { Clickable } from './clickable'
import { IconChevronRightSolid } from './icon'

export type IListItem = {
  renderStartIcon: (props: { className: string }) => React.ReactNode
  text: string
  onClick: () => void
  link?: boolean
}

export type IList = {
  items: IListItem[]
}

export const List = (props: IList) => {
  return (
    <div className="flex w-full flex-col gap-0 divide-y divide-neutral-700">
      {props.items.map((item) => (
        <ListItem key={item.text} {...item} />
      ))}
    </div>
  )
}

export const ListItem = (props: IListItem) => {
  return (
    <Clickable
      className="flex w-full flex-row items-center gap-2 px-4 py-2 text-left"
      onClick={props.onClick}
    >
      <div>{props.renderStartIcon({ className: 'size-8' })}</div>
      <div className="flex-1">{props.text}</div>
      <div>
        <IconChevronRightSolid className="size-8" />
      </div>
    </Clickable>
  )
}
