import { useEffect, useRef } from 'react'

export const useIntersectionObserver = (
  ref: React.RefObject<HTMLElement | null>,
  onVisible: () => void
) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onVisible()
        }
      })
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [ref, onVisible])
}

export const WrapIntersectionObserver = (props: {
  children: React.ReactNode
  onVisible: () => void
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  useIntersectionObserver(ref, props.onVisible)
  return (
    <div ref={ref} className={props.className}>
      {props.children}
    </div>
  )
}
