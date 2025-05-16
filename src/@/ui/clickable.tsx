import { cn } from './cn'

export const Clickable = (props: {
  children: React.ReactNode
  onClick: () => void
  className?: string
}) => {
  return (
    <button
      className={cn(props.className, 'cursor-pointer transition-transform active:scale-95')}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
