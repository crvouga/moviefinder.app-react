import { PGlite } from '@electric-sql/pglite'
import { createContext, useContext } from 'react'
import { FrontendMediaDb } from '../media/media-db/frontend'
import { IMediaDb } from '../media/media-db/interface'

export type Ctx = {
  mediaDb: IMediaDb
}

// const db = new PGlite()
// @ts-ignore
window.PGlite = PGlite

const init = (): Ctx => {
  const mediaDb = FrontendMediaDb({
    t: 'trpc-client',
  })

  return {
    mediaDb,
  }
}

const Context = createContext<Ctx>(init())

const Provider = (props: { children: React.ReactNode; ctx: Ctx }) => {
  return <Context.Provider value={props.ctx}>{props.children}</Context.Provider>
}

export const useCtx = () => {
  return useContext(Context)
}

export const Ctx = {
  init,
  Provider,
  useCtx,
}
