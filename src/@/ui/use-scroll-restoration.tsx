import { useEffect } from 'react'
import { TimeSpan } from '../time-span'

const scrollTopStore = new Map<string, number>()

export const useScrollRestoration = (input: {
  scrollableRef: React.RefObject<HTMLElement>
  scrollKey: string
  delay?: TimeSpan
}) => {
  useEffect(() => {
    const setScrollTop = () => {
      const scrollTop = scrollTopStore.get(input.scrollKey)
      if (!scrollTop) return
      const element = input.scrollableRef.current
      if (!element) return
      element.scrollTop = scrollTop
    }
    const onScroll = () => {
      const scrollTop = input.scrollableRef.current?.scrollTop
      if (!scrollTop) return
      scrollTopStore.set(input.scrollKey, scrollTop)
    }

    setScrollTop()
    input.scrollableRef.current?.addEventListener('scroll', onScroll)
    return () => {
      input.scrollableRef.current?.removeEventListener('scroll', onScroll)
    }
  }, [input.scrollableRef, input.scrollKey])
}
