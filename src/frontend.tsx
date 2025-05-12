import React from 'react'
import ReactDOM from 'react-dom/client'
import { z } from 'zod'
import { Ctx } from '~/app/ctx/frontend.tsx'
import { App } from './app/frontend.tsx'

const main = async () => {
  const root = document.getElementById('root')

  if (!root) throw new Error('Root element not found')

  const reactRoot = ReactDOM.createRoot(root)

  const ctx = await Ctx.init()

  // @ts-ignore
  window.ctx = ctx
  // @ts-ignore
  window.q = async (sql: string) => {
    const result = await ctx.dbConn.query({ parser: z.unknown(), sql })
    console.log(result)
  }

  reactRoot.render(
    <React.StrictMode>
      <Ctx.Provider ctx={ctx}>
        <App />
      </Ctx.Provider>
    </React.StrictMode>
  )
}

main()
