import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CrashBoard from 'crashboard-sdk'

CrashBoard.init({
  apiKey: 'cb_live_f485260e-1dd0-4b64-b15c-dcee86d35e50',
  project: 'Codesync',
  env: 'development',
  ingestUrl: 'http://localhost:3000/api/ingest'
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
