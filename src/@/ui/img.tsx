import { forwardRef, useState } from 'react'
import { cn } from './cn'

const isImageLoaded = (url: string | undefined): boolean => {
  if (!url) return false
  const img = new Image()
  img.src = url
  return img.complete
}

export const preloadImages = (input: { srcList: (string | undefined)[] }) => {
  for (const src of input.srcList) {
    if (!src) continue
    const img = new Image()
    img.src = src
  }
}

export const Img = forwardRef<
  HTMLDivElement,
  {
    src?: string
    alt?: string
    className?: string
    style?: React.CSSProperties
  }
>((props, ref) => {
  const [loading, setLoading] = useState(() => !isImageLoaded(props.src))

  return (
    <div ref={ref} className={`relative ${props.className ?? ''}`} style={props.style}>
      {loading && (
        <div className="absolute inset-0 animate-pulse rounded bg-neutral-600" aria-busy={true} />
      )}
      <img
        alt={props.alt}
        src={props.src}
        aria-hidden={!loading}
        style={{ outline: 'none', border: 'none' }}
        className={cn('h-full w-full bg-neutral-600 object-cover', loading && 'opacity-0')}
        onLoad={() => setLoading(false)}
      />
    </div>
  )
})
