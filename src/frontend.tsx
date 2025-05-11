import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/frontend.tsx'
import { Ctx } from '~/app/ctx/frontend.tsx'

const root = document.getElementById('root')

if (!root) throw new Error('Root element not found')

const reactRoot = ReactDOM.createRoot(root)

const ctx = await Ctx.init()

// @ts-ignore
window.ctx = ctx

reactRoot.render(
  <React.StrictMode>
    <Ctx.Provider ctx={ctx}>
      <App />
    </Ctx.Provider>
  </React.StrictMode>
)
