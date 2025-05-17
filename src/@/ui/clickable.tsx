import { cn } from './cn'

export const Clickable = (props: {
  children: React.ReactNode
  onClick: () => void
  onPointerDown?: () => void
  onHover?: () => void
  className?: string
}) => {
  return (
    <button
      className={cn(props.className, 'cursor-pointer transition-transform active:scale-95')}
      onClick={props.onClick}
      onPointerDown={props.onPointerDown}
      onPointerEnter={props.onHover}
      onPointerLeave={props.onHover}
    >
      {props.children}
    </button>
  )
}
