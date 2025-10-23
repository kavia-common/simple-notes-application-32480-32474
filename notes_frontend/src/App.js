import Blits from '@lightningjs/blits'
import Home from './pages/Home.js'
import { registerTheme } from './theme.js'

/**
 * Blits Application root:
 * - Registers Ocean theme globally on boot
 * - Sets up routing with RouterView
 */
export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>
  `,
  routes: [
    { path: '/', component: Home, options: { transition: 'fade' } }
  ],
  hooks: {
    boot() {
      registerTheme(this)
    }
  }
})
