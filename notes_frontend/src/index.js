import Blits from '@lightningjs/blits'
import App from './App.js'

/**
 * Launch the Blits app with keyboard mappings suitable for desktop.
 * The environment preview serves on port 3000 via Vite.
 */
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
