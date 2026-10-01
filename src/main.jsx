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
  // "Script error." is the browser's generic mask for any cross-origin script
  // failure — the real message and stack are withheld by the same-origin
  // policy. It is never actionable from this app, so suppress it regardless of
  // whether a filename is attached (cross-origin scripts often report their
  // URL as filename while still hiding the detail).
  if (event.message === 'Script error.') {
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const msg = typeof reason === 'string' ? reason : reason?.message;
  if (msg === 'Script error.') {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)