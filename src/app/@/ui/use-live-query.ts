import { useLayoutEffect, useState } from 'react'
import { useCtx } from '~/app/frontend/ctx'
import { Sub } from '../../../@/pub-sub'

export const useLiveQuery = <T extends Record<string, unknown>>(input: {
  queryKey: string
  queryFn: () => Sub<T> | null
}): T | null => {
  const ctx = useCtx()

  const init = (): T | null => {
    const cached = ctx.queryCache.get(input.queryKey)
    if (cached) return cached as T
    return null
  }

  const [value, setValue] = useState<T | null>(init)

  useLayoutEffect(() => {
    const init_ = init()
    setValue(init_)
    return input.queryFn()?.subscribe((value) => {
      setValue(value)
      ctx.queryCache.set(input.queryKey, value)
    })
  }, [input.queryKey])

  return value
}
