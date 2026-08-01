import '@fontsource-variable/roboto/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { App } from './app/App'
import { setupApp } from './app/config/setupApp'

setupApp()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
