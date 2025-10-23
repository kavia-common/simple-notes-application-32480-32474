import Blits from '@lightningjs/blits'
import Home from './pages/Home.js'
import { registerTheme } from './theme.js'

/**
 * Blits Application root:
 * - Registers Ocean theme globally on boot
 * - Sets up routing with RouterView
 * - Displays a tiny fallback text if RouterView fails
 */
export default Blits.Application({
  template: `
    <Element>
      <RouterView />
      <Text x="20" y="20" :content="$fallback" color="0xffef4444" fontSize="18" />
    </Element>
  `,
  routes: [
    { path: '/', component: Home, options: { transition: 'fade' } }
  ],
  state() {
    return {
      fallback: ''
    }
  },
  computed: {
    $fallback() {
      // If router hasn't injected anything, provide a subtle hint for debugging
      try {
        const hasChildren = (this.children && this.children.length > 0)
        return hasChildren ? '' : 'Loading...'
      } catch {
        return 'Loading...'
      }
    }
  },
  hooks: {
    boot() {
      try {
        registerTheme(this)
      } catch (e) {
        // Surface theme errors rather than silent fail
        console.error('Theme registration failed:', e)
        this.fallback = 'Theme error'
      }
    }
  }
})
