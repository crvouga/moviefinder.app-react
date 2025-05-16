import React from 'react'
import ReactDOM from 'react-dom/client'
import { Ctx } from '~/app/frontend/ctx.tsx'
import { Err, Ok, Result, unwrap } from './@/result.ts'
import { App } from './app/frontend.tsx'
import { registerConsoleTools } from './app/frontend/register-console-tools.ts'
import { registerServiceWorker } from './app/frontend/register-service-worker.ts'

const main = (): Result<null, Error> => {
  const root = document.getElementById('root')

  if (!root) return Err(new Error('Root element not found'))

  const reactRoot = ReactDOM.createRoot(root)

  const ctx = Ctx.init()

  registerConsoleTools({ ctx })
  registerServiceWorker()

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
