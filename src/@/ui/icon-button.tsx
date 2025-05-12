import { ReactNode } from 'react'

export const IconButton = (props: {
  onClick?: () => void
  onPointerDown?: () => void
  renderIcon: (props: { className: string }) => ReactNode
  disabled?: boolean
}) => {
  return (
    <button
      onClick={props.onClick}
      onPointerDown={props.onPointerDown}
      className="flex aspect-square size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full p-1"
      disabled={props.disabled}
    >
      {props.renderIcon({ className: 'w-full h-full' })}
    </button>
  )
}

export const IconButtonEmpty = () => {
  return <IconButton disabled onClick={() => {}} renderIcon={() => null} />
}
