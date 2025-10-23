import Blits from '@lightningjs/blits'

/**
 * A small rounded icon button with accent color and focus feedback.
 * props:
 *  - label: string (accessible text)
 *  - bgColor: number (ARGB)
 *  - icon: optional text char
 */
export default Blits.Component('IconButton', {
  props: ['label', 'bgColor', 'icon'],
  state() {
    return {
      hover: false,
      focused: false
    }
  },
  template: `
    <Element :w="$w" :h="$h">
      <Element
        x="0" y="0"
        :w="$w" :h="$h"
        :color="$bg"
        :alpha="$alpha"
        :scale="$scale"
        :shader="{ type: 'RoundedRectangle', radius: 12 }"
      />
      <Text
        :x="$w / 2"
        :y="$h / 2 - 14"
        mountX="0.5"
        mountY="0.5"
        :content="$iconText"
        :color="$iconColor"
        :fontSize="28"
      />
      <Text
        :x="$w / 2"
        :y="$h - 22"
        mountX="0.5"
        :content="$label"
        :color="$labelColor"
        :fontSize="18"
      />
    </Element>
  `,
  computed: {
    $w() { return 120 },
    $h() { return 80 },
    $bg() {
      const { getSafeTheme } = require('../theme.js')
      const theme = getSafeTheme(this)
      const c = this.bgColor ?? (theme.colors.primary)
      return c
    },
    $alpha() {
      return this.focused ? 1 : (this.hover ? 0.9 : 0.85)
    },
    $scale() {
      return this.focused ? 1.06 : (this.hover ? 1.02 : 1.0)
    },
    $iconText() {
      return this.icon || '+'
    },
    $iconColor() {
      const { getSafeTheme } = require('../theme.js')
      const theme = getSafeTheme(this)
      return theme.colors.surface
    },
    $labelColor() {
      const { getSafeTheme } = require('../theme.js')
      const theme = getSafeTheme(this)
      return theme.colors.text
    }
  },
  input: {
    enter() {
      this.methods?.click?.()
    }
  },
  methods: {
    // PUBLIC_INTERFACE
    click() {
      /** Emits a click event upward. */
      this.parent?.$emit?.('icon-click', { source: this })
    },
    focus() { this.focused = true },
    unfocus() { this.focused = false }
  }
})
