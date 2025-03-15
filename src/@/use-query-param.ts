import { useEffect, useState } from 'react'
import { Codec } from './codec'

export const useQueryParam = <T>(config: {
  param: string
  defaultValue: T
  codec: Codec<T>
}): {
  value: T
  push: (value: T) => void
} => {
  const { param, defaultValue, codec } = config
  const searchParams = useSearchParams()
  const paramValue = searchParams.get(param)
  return {
    value: paramValue ? codec.decode(paramValue) || defaultValue : defaultValue,
    push: (value: T) => {
      searchParams.set(param, codec.encode(value))
      window.history.pushState({}, '', window.location.pathname + '?' + searchParams.toString())
      window.dispatchEvent(new Event('pushstate'))
    },
  }
}

const useSearchParams = (): URLSearchParams => {
  const [searchParams, setSearchParams] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params
  })

  useEffect(() => {
    const onChange = () => {
      setSearchParams(new URLSearchParams(window.location.search))
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

  return searchParams
}
