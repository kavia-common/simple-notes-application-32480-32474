import Blits from '@lightningjs/blits'
import NotesList from '../components/NotesList.js'
import EditorPane from '../components/EditorPane.js'

/**
 * Home page: Header + Notes list + Editor pane
 * - Uses Ocean Professional theme tokens
 * - Wires selection/create from NotesList to EditorPane
 * - Handles update/delete events to refresh list and selection
 */
export default Blits.Component('Home', {
  components: { NotesList, EditorPane },
  state() {
    return {
      selected: null
    }
  },
  template: `
    <Element :w="$w" :h="$h" :color="$theme.colors.bg">
      <!-- Header pseudo-gradient band -->
      <Element x="0" y="0" :w="$w" h="120" :color="$theme.colors.primary" :alpha="0.08" />
      
      <!-- Header Card -->
      <Element x="32" y="24" :w="$w - 64" h="88">
        <Element
          :w="$w - 64" h="88"
          :color="$theme.colors.surface"
          :shader="{ type: 'RoundedRectangle', radius: 20 }"
        />
        <Text x="32" y="24" :content="'Ocean Notes'" :color="$theme.colors.text" fontSize="36" />
        <Text x="32" y="58" :content="'Modern notes with autosave and search'" :color="$theme.colors.textMuted" fontSize="22" />
      </Element>

      <!-- Main content: split layout -->
      <Element x="32" y="136" :w="$w - 64" :h="$h - 168">
        <!-- Left: Notes list -->
        <Element x="0" y="0" w="560" :h="$h - 168">
          <NotesList :selectedId="$selected?.id" :onSelect="$handleSelect" :onCreate="$handleCreate" />
        </Element>
        <!-- Right: Editor -->
        <Element x="592" y="0" :w="$w - 64 - 592" :h="$h - 168">
          <EditorPane :note="$selected" />
        </Element>
      </Element>
    </Element>
  `,
  computed: {
    $theme() {
      // Canonical accessor that never returns undefined
      const { getTheme } = require('../theme.js')
      return getTheme(this)
    },
    $w() { return 1920 },
    $h() { return 1080 }
  },
  methods: {
    // PUBLIC_INTERFACE
    $handleSelect(n) {
      /** Handles selection from NotesList. */
      this.selected = n
    },
    // PUBLIC_INTERFACE
    $handleCreate(n) {
      /** Handles creation from NotesList and selects it. */
      this.selected = n
    }
  },
  hooks: {
    ready() {
      // Listen to editor events to refresh list and selection
      this.$on('note-updated', (n) => {
        const l = this.$$('NotesList')[0]
        l?.refresh?.()
        if (n?.id === this.selected?.id) this.selected = n
      })
      this.$on('note-deleted', ({ id }) => {
        const l = this.$$('NotesList')[0]
        l?.refresh?.()
        if (this.selected?.id === id) this.selected = null
      })
    }
  },
  input: {
    key(e) {
      const k = (e?.key || '').toLowerCase()
      const list = this.$$('NotesList')[0]
      const editor = this.$$('EditorPane')[0]
      if (k === 'n') {
        list?.methods?.createNew?.()
      } else if (k === 'f') {
        // focus list for typing to filter
        if (list) this.$setFocus(list)
      } else if (k === 'e') {
        // focus editor, content field
        editor?.methods?.focusContent?.()
        if (editor) this.$setFocus(editor)
      }
    }
  }
})
