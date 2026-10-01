/**
 * Cross-origin "Script error." suppression.
 *
 * Must be imported as the very first module in main.jsx so these handlers are
 * in place before any other module (including the Base44 SDK) initializes its
 * own error monitoring.
 *
 * Third-party embeds (Virtuous giving form, Stripe, GTM) throw inside their
 * own minified cross-origin scripts, and the browser's same-origin policy
 * masks the real message as "Script error." with no stack. These are never
 * actionable from this app — each embed component manages its own render and
 * failed states — so we suppress them at every layer the platform might use to
 * surface them: window.onerror, the error event, unhandledrejection, and
 * console.error.
 */

const isScriptError = (msg) => {
  if (!msg) return false;
  const normalized = String(msg).trim().toLowerCase().replace(/\.$/, '');
  return normalized === 'script error';
};

// window.onerror is called before addEventListener('error') handlers.
// Returning true suppresses the default browser error reporting.
window.onerror = function (message) {
  if (isScriptError(message)) return true;
};

window.addEventListener('error', (event) => {
  if (isScriptError(event.message)) {
    event.preventDefault();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const msg = typeof reason === 'string' ? reason : reason?.message;
  if (isScriptError(msg)) {
    event.preventDefault();
  }
});

// Some third-party scripts log errors via console.error rather than throwing;
// platform error monitoring may also capture console output.
const originalConsoleError = console.error;
console.error = function (...args) {
  if (args.length === 1 && isScriptError(args[0])) return;
  return originalConsoleError.apply(console, args);
};