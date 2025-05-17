import { cn } from './cn'

export const CollapsibleArea = (props: {
  children: React.ReactNode
  collapsiedHeight?: number
  className?: string
}) => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-transparent before:to-black',
        props.className
      )}
      style={{ height: props.collapsiedHeight }}
    >
      {props.children}
    </div>
  )
}
