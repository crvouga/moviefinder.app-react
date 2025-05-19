import { Repl } from '@electric-sql/pglite-repl'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { Codec } from '~/@/codec'
import { IPgliteInstance } from '~/@/pglite/types'
import { NotAsked, Ok, RemoteResult } from '~/@/result'
import { useQueryParam } from '~/@/use-query-param'
import { useCtx } from './ctx'

const useModalState = () => {
  const queryParam = useQueryParam({
    codec: Codec.fromZod(
      z.object({
        isPgliteReplOpen: z.boolean(),
      })
    ),
    param: 'pglite',
    defaultValue: {
      isPgliteReplOpen: false,
    },
  })

  return queryParam
}

export const PgliteModal = () => {
  const modalState = useModalState()

  return (
    <>
      <button
        className="absolute top-0 right-0 z-[60] cursor-pointer bg-black px-2 py-1 font-bold text-white"
        onClick={() => modalState.push({ isPgliteReplOpen: !modalState.value.isPgliteReplOpen })}
      >
        {modalState.value.isPgliteReplOpen ? 'Close' : 'Open'}
      </button>
      {modalState.value.isPgliteReplOpen && (
        <div className="absolute inset-0 z-50">
          <PgliteRepl />
        </div>
      )}
    </>
  )
}

export const PgliteRepl = () => {
  const ctx = useCtx()
  const [state, setState] = useState<{
    pglite: RemoteResult<IPgliteInstance, Error>
  }>({
    pglite: NotAsked,
  })
  useEffect(() => {
    ctx.pglite.then((pglite) => {
      setState((prev) => ({
        ...prev,
        pglite: Ok(pglite),
      }))
    })
  }, [ctx])

  switch (state.pglite.t) {
    case 'not-asked':
      return <div>Loading...</div>
    case 'loading':
      return <div>Loading...</div>
    case 'error':
      return <div>Error: {state.pglite.error.message}</div>
    case 'ok':
      return <Repl theme="dark" pg={state.pglite.value} />
  }
}
