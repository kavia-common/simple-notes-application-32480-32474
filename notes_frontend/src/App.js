import Blits from '@lightningjs/blits'
import Home from './pages/Home.js'
import { registerTheme, getTheme } from './theme.js'

/**
 * Blits Application root:
 * - Registers Ocean theme globally on boot (synchronously)
 * - Sets up routing with RouterView
 * - Displays a tiny fallback text if RouterView fails
 * - Shows a subtle banner if any component accessed theme before registration
 */
export default Blits.Application({
  template: `
    <Element>
      <RouterView />
      <Text x="20" y="20" :content="$fallback" color="0xffef4444" fontSize="18" />
      <Element v-if="$themeAssertError" x="20" y="80" w="900" h="42">
        <Element :w="900" h="42" color="0xffef4444" :alpha="0.2" :shader="{ type: 'RoundedRectangle', radius: 8 }" />
        <Text x="12" y="10" :content="$themeAssertError" color="0xff111827" fontSize="22" />
      </Element>
      <Element v-if="$showThemeBanner" x="20" y="50" w="520" h="36">
        <Element :w="520" h="36" color="0xfff59e0b" :alpha="0.15" :shader="{ type: 'RoundedRectangle', radius: 8 }" />
        <Text x="12" y="8" content="Theme fallback used temporarily." color="0xff111827" fontSize="20" />
      </Element>
    </Element>
  `,
  routes: [
    { path: '/', component: Home, options: { transition: 'fade' } }
  ],
  state() {
    return {
      fallback: '',
      showThemeBanner: false,
      themeAssertError: ''
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
    },
    $showThemeBanner() {
      return !!this.showThemeBanner
    },
    $themeAssertError() {
      return this.themeAssertError || ''
    }
  },
  hooks: {
    boot() {
      try {
        // Prefer global injected theme if present, then register theme
        if (typeof window !== 'undefined' && window.__OCEAN_THEME) {
          this.$theme = window.__OCEAN_THEME
        }
        if (!this.$theme?.colors) {
          registerTheme(this)
        }
      } catch (e) {
        console.error('Theme registration failed:', e)
        this.fallback = 'Theme error'
      }
    },
    created() {
      // Ensure theme is synchronously present
      try {
        if (!this.$theme?.colors && typeof window !== 'undefined' && window.__OCEAN_THEME) {
          this.$theme = window.__OCEAN_THEME
        }
        if (!this.$theme?.colors) {
          registerTheme(this)
        }
        // Minimal runtime assert - do not throw; render banner instead
        const t = getTheme(this)
        // Access primary to ensure colors exists
        if (!t?.colors?.primary && !t?.colors) {
          this.themeAssertError = 'Theme colors missing; using fallback.'
        }
      } catch (e) {
        this.themeAssertError = `Theme initialization issue: ${e?.message || e}`
      }
      // If any pre-render component used fallback theme, show visual banner briefly
      if (this.__theme_missing_once) {
        this.showThemeBanner = true
        // Auto-hide after a short delay
        this.$setTimeout(() => { this.showThemeBanner = false }, 2500)
      }
    }
  }
})
