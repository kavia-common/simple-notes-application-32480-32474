import Blits from '@lightningjs/blits'
import App from './App.js'
import { DEFAULT_THEME } from './theme.js'

/**
 * Launch the Blits app with keyboard mappings suitable for desktop.
 * The environment preview serves on port 3000 via Vite.
 * Adds defensive error logging to surface runtime errors.
 */

(function bootstrapClientSide() {
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

  // Inject a hard fail-safe default theme early in boot
  try {
    if (typeof window !== 'undefined') {
      window.__OCEAN_THEME = window.__OCEAN_THEME || DEFAULT_THEME
    }
  } catch (e) {
    console.warn('Theme global injection failed, continuing with app init', e)
  }
})();

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
