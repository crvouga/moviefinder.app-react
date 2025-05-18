import { useEffect } from 'react'
import { TimeSpan } from '../time-span'

const scrollTopStore = new Map<string, number>()

export const useScrollRestoration = (input: {
  scrollableRef: React.RefObject<HTMLElement>
  scrollKey: string
  delay?: TimeSpan
}) => {
  useEffect(() => {
    const ref = input.scrollableRef.current
    if (!ref) return

    const setScrollTop = () => {
      const scrollTop = scrollTopStore.get(input.scrollKey)
      if (!scrollTop) return
      ref.scrollTop = scrollTop
    }

    const onScroll = () => {
      scrollTopStore.set(input.scrollKey, ref.scrollTop)
    }

    setScrollTop()
    input.scrollableRef.current?.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      input.scrollableRef.current?.removeEventListener('scroll', onScroll)
    }
  }, [input.scrollableRef, input.scrollKey])
}
