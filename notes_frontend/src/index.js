import Blits from '@lightningjs/blits'
import App from './App.js'

/**
 * Launch the Blits app with keyboard mappings suitable for desktop.
 * The environment preview serves on port 3000 via Vite.
 * Adds defensive error logging to surface runtime errors.
 */

// Global error hooks to surface errors in console and as overlay element
function installGlobalErrorOverlay() {
  const showOverlay = (message) => {
    try {
      let el = document.getElementById('blits-error-overlay')
      if (!el) {
        el = document.createElement('div')
        el.id = 'blits-error-overlay'
        el.style.position = 'fixed'
        el.style.left = '0'
        el.style.right = '0'
        el.style.top = '0'
        el.style.zIndex = '2147483647'
        el.style.background = 'rgba(239, 68, 68, 0.95)'
        el.style.color = '#fff'
        el.style.fontFamily = 'monospace'
        el.style.fontSize = '14px'
        el.style.padding = '10px 14px'
        el.style.whiteSpace = 'pre-wrap'
        document.body.appendChild(el)
      }
      el.textContent = `Runtime error: ${message}`
    } catch (err) {
      // Minimal log to satisfy lint and to surface potential DOM issues
      // eslint-disable-next-line no-console
      console.warn('Failed to show error overlay. Continuing without overlay.', err)
    }
  }

  window.addEventListener('error', (e) => {
    console.error('[Global Error]', e?.error || e?.message || e)
    showOverlay(e?.message || String(e?.error || e))
  })
  window.addEventListener('unhandledrejection', (e) => {
    console.error('[Unhandled Rejection]', e?.reason || e)
    showOverlay(e?.reason?.message || String(e?.reason || e))
  })
}

installGlobalErrorOverlay()

Blits.Launch(App, 'app', {
  w: 1920,
  h: 1080,
  keys: {
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    enter: ['Enter'],
    back: ['Escape']
  }
})
