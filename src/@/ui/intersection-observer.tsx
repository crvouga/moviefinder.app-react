import { useEffect } from 'react'

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
