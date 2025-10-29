import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NetworkBackgroundDemo from './NetworkBackgroundDemo.jsx'

// Check URL parameter to show demo
const urlParams = new URLSearchParams(window.location.search)
const showDemo = urlParams.get('demo') === 'true'

// Add demo link info to console
console.log('🚀 3D Network Demo available at: ' + window.location.origin + '?demo=true')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {showDemo ? <NetworkBackgroundDemo /> : <App />}
  </StrictMode>,
)
