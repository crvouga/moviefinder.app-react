import { useState } from 'react'
import { cn } from './cn'

export const CollapsibleArea = (props: {
  children: React.ReactNode
  collapsiedHeight?: number
  className?: string
}) => {
  const [state, setState] = useState({ collapsed: true, height: 0 })

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        state.collapsed &&
          `before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:via-black/50 before:to-black`,
        props.className
      )}
      style={{
        height: state.collapsed ? props.collapsiedHeight : undefined,
        minHeight: state.collapsed ? undefined : props.collapsiedHeight,
      }}
      onClick={() => {
        setState((prev) => ({ ...prev, collapsed: !prev.collapsed }))
      }}
    >
      {props.children}
    </div>
  )
}
