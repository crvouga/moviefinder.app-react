import { cn } from './cn'

const Container = (props: {
  children: React.ReactNode
  className?: string
  direction?: 'horizontal' | 'vertical'
  behavior?: 'smooth' | 'auto'
}) => {
  const directionClass = props.direction === 'vertical' ? 'snap-y' : 'snap-x'
  const scrollBehavior = props.behavior ?? 'smooth'

  return (
    <div
      className={cn(
        'flex w-full',
        directionClass,
        'snap-mandatory overflow-x-auto',
        props.className
      )}
      style={{ scrollBehavior }}
    >
      {props.children}
    </div>
  )
}

const Item = (props: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('flex-none snap-center', props.className)}>{props.children}</div>
}

export const SnapScroller = {
  Container,
  Item,
}
