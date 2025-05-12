import { forwardRef, useEffect, useState } from 'react'
import { cn } from './cn'

export const Img = forwardRef<
  HTMLDivElement | HTMLImageElement,
  { src?: string | undefined; className?: string; alt?: string }
>((props, ref) => {
  const [state, setState] = useState<'loading' | 'error' | 'loaded'>('loading')

  useEffect(() => {
    if (!props.src) {
      return
    }
    const img = new Image()
    img.src = props.src
    img.onload = () => setState('loaded')
    img.onerror = () => setState('error')
  }, [props.src])

  switch (state) {
    case 'loading':
    case 'error': {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={cn(props.className, 'animate-pulse bg-neutral-700')}
        />
      )
    }
    case 'loaded': {
      return (
        <img
          ref={ref as React.Ref<HTMLImageElement>}
          src={props.src}
          className={props.className}
          alt={props.alt}
        />
      )
    }
  }
})
