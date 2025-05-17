import { ReactNode } from 'react'
import { cn } from './cn'

export type BottomButton = {
  label: string
  icon: (props: { className: string }) => ReactNode
  selected: boolean
  onClick: () => void
}

export type BottomButtonsProps = {
  buttons: BottomButton[]
}

export const BottomButtons = (props: BottomButtonsProps) => {
  return (
    <div className="flex w-full justify-around">
      {props.buttons.map((button) => (
        <BottomButton key={button.label} button={button} />
      ))}
    </div>
  )
}

const BottomButton = (props: { button: BottomButton }) => {
  return (
    <button
      onPointerDown={props.button.onClick}
      className={cn(
        'flex h-16 flex-1 cursor-pointer flex-col items-center justify-center',
        props.button.selected ? 'text-blue-500' : 'text-neutral-200'
      )}
    >
      <span className="text-2xl">{props.button.icon({ className: 'size-6' })}</span>
      <span className="text-xs">{props.button.label}</span>
    </button>
  )
}
