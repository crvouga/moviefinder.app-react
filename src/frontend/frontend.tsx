import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from '../app/frontend.tsx'

const root = document.getElementById('root')

if (!root) throw new Error('Root element not found')

const reactRoot = ReactDOM.createRoot(root)

reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
