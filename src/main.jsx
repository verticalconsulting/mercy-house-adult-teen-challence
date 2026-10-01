import '@/lib/suppressScriptErrors';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
// Roboto self-hosted (latin subset, font-display: swap) so text never waits on
// fonts.googleapis.com. Same family and weights the brand guide specifies.
import '@fontsource/roboto/latin-400.css'
import '@fontsource/roboto/latin-500.css'
import '@fontsource/roboto/latin-700.css'
import '@fontsource/roboto/latin-900.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)