import React from 'react'
import ReactDOM from 'react-dom/client'
import { Ctx } from '~/app/frontend/ctx.tsx'
import { Err, Ok, Result, unwrap } from './@/result.ts'
import { App } from './app/frontend.tsx'
import { attachTools } from './app/frontend/window.ts'

const main = (): Result<null, Error> => {
  const root = document.getElementById('root')

  if (!root) return Err(new Error('Root element not found'))

  const reactRoot = ReactDOM.createRoot(root)

  const ctx = Ctx.init()

  attachTools(ctx)

  reactRoot.render(
    <React.StrictMode>
      <Ctx.Provider ctx={ctx}>
        <App />
      </Ctx.Provider>
    </React.StrictMode>
  )

  return Ok(null)
}

unwrap(main())
