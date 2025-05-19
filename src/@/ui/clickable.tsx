import { cn } from './cn'

export const Clickable = (props: {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  onPointerDown?: () => void
  onHover?: () => void
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}) => {
  return (
    <button
      className={cn(
        props.className,
        'h-fit cursor-pointer transition-transform active:scale-95',
        props.disabled && 'cursor-not-allowed opacity-60'
      )}
      onClick={props.onClick}
      onPointerDown={props.onPointerDown}
      onPointerEnter={props.onHover}
      onPointerLeave={props.onHover}
      disabled={props.disabled}
      type={props.type}
      role="button"
    >
      {props.children}
    </button>
  )
}
