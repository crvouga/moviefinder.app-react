import { ReactNode } from 'react'
import { Clickable } from './clickable'

export const IconButton = (props: {
  onClick?: () => void
  onPointerDown?: () => void
  renderIcon: (props: { className: string }) => ReactNode
  disabled?: boolean
}) => {
  return (
    <Clickable
      onClick={props.onClick}
      onPointerDown={props.onPointerDown}
      className="flex aspect-square size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full p-1"
      disabled={props.disabled}
    >
      {props.renderIcon({ className: 'w-full h-full' })}
    </Clickable>
  )
}

export const IconButtonEmpty = () => {
  return <IconButton disabled onClick={() => {}} renderIcon={() => null} />
}
