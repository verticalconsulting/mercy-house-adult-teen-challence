import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Suppress cross-origin "Script error." reports. Third-party embeds (e.g. the
// Virtuous giving form loaded from cdn.virtuoussoftware.com) throw inside
// their own minified cross-origin script, and the browser masks the real
// message as "Script error." with no stack. These are not bugs in this app and
// are not actionable; each embed component manages its own render/failed state.
window.addEventListener('error', (event) => {
  if (event.message === 'Script error.' && (!event.filename || event.filename === '')) {
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  if (reason && typeof reason === 'object' && reason.message === 'Script error.') {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)