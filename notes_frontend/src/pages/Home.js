import Blits from '@lightningjs/blits'
import NotesList from '../components/NotesList.js'
import EditorPane from '../components/EditorPane.js'
import OceanTheme from '../theme.js'

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
          <NotesList :selectedId="$selected?.id" />
        </Element>
        <!-- Right: Editor -->
        <Element x="592" y="0" :w="$w - 64 - 592" :h="$h - 168">
          <EditorPane :note="$selected" />
        </Element>
      </Element>
    </Element>
  `,
  computed: {
    $theme() { return this.app.$theme || OceanTheme },
    $w() { return 1920 },
    $h() { return 1080 }
  },
  hooks: {
    mounted() {
      const list = this.$$('NotesList')[0]
      if (list) {
        list.onSelect = (n) => { this.selected = n }
        list.onCreate = (n) => { this.selected = n }
      }
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
        list?.createNew?.()
      } else if (k === 'f') {
        // focus list for typing to filter
        this.focus({ to: list })
      } else if (k === 'e') {
        // focus editor, content field
        editor?.focusContent?.()
      }
    }
  }
})
