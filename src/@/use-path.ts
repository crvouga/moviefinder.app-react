import { useEffect, useState } from 'react'
import { Codec } from './codec'

export const usePath = <T>(config: {
  defaultValue: T
  codec: Codec<T>
}): {
  value: T
  push: (value: T) => void
} => {
  const { defaultValue, codec } = config
  const path = usePathname()
  const pathValue = path.slice(1) // Remove leading slash
  return {
    value: pathValue ? codec.decode(pathValue) || defaultValue : defaultValue,
    push: (value: T) => {
      const encoded = codec.encode(value)
      window.history.pushState({}, '', '/' + encoded)
      window.dispatchEvent(new Event('pushstate'))
    },
  }
}

const usePathname = (): string => {
  const [pathname, setPathname] = useState(() => {
    return window.location.pathname
  })

  useEffect(() => {
    const onChange = () => {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', onChange)
    window.addEventListener('pushstate', onChange)
    window.addEventListener('replacestate', onChange)
    window.addEventListener('hashchange', onChange)

    return () => {
      window.removeEventListener('popstate', onChange)
      window.removeEventListener('pushstate', onChange)
      window.removeEventListener('replacestate', onChange)
      window.removeEventListener('hashchange', onChange)
    }
  }, [])

  return pathname
}
