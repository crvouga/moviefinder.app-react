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
      aria-expanded={!state.collapsed}
      aria-controls={props.collapsiedHeight?.toString()}
      role="button"
      tabIndex={0}
      className={cn('relative w-full cursor-pointer overflow-hidden', props.className)}
      style={{
        height: state.collapsed ? props.collapsiedHeight : undefined,
        minHeight: state.collapsed ? undefined : props.collapsiedHeight,
      }}
      onClick={() => {
        setState((prev) => ({ ...prev, collapsed: !prev.collapsed }))
      }}
    >
      {props.children}
      {state.collapsed && (
        <div className="absolute inset-0 top-1/4 bg-gradient-to-b from-transparent to-black" />
      )}
    </div>
  )
}
