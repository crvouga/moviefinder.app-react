import { useEffect, useState } from 'react'
import { NotAsked, RemoteResult, Result } from './result'

export const useRemoteResult = <TOk, TErr>(
  query: () => Promise<Result<TOk, TErr>>,
  deps: unknown[]
): RemoteResult<TOk, TErr> => {
  const [value, setValue] = useState<RemoteResult<TOk, TErr>>(NotAsked)
  useEffect(() => {
    query().then(setValue)
  }, deps)
  return value
}
