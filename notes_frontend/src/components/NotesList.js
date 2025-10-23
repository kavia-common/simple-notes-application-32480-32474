import Blits from '@lightningjs/blits'
import NoteService from '../services/NoteService.js'

export default Blits.Component('NotesList', {
  props: ['onSelect', 'onCreate', 'selectedId'],
  state() {
    const items = NoteService.getNotes()
    return {
      q: '',
      items,
      view: items,
      focusIndex: 0
    }
  },
  components: {},
  template: `
    <Element :w="$w" :h="$h">
      <!-- Card background -->
      <Element
        x="0" y="0"
        :w="$w" :h="$h"
        :color="$theme.colors.surface"
        :shader="{ type: 'RoundedRectangle', radius: 16 }"
      />
      <!-- Header row -->
      <Element x="16" y="16" :w="$w - 32" h="48">
        <Text :content="'Notes'" :color="$theme.colors.text" fontSize="28" />
      </Element>
      <!-- Search chip -->
      <Element x="16" y="72" :w="$w - 32" h="48">
        <Element
          :w="$w - 32" h="48"
          :color="$theme.colors.bg"
          :shader="{ type: 'RoundedRectangle', radius: 12 }"
        />
        <Text x="16" y="12" :content="$searchLabel" :color="$theme.colors.textMuted" fontSize="22" />
      </Element>

      <!-- Empty state -->
      <Element
        x="16" :y="$listY" :w="$w - 32" :h="$listH"
        v-if="$view.length === 0"
      >
        <Element :w="$w - 32" :h="$listH" :color="$theme.colors.surfaceAlt" :shader="{ type: 'RoundedRectangle', radius: 12 }" />
        <Text x="32" y="32" :content="'No notes yet. Press N to create a note.'" :color="$theme.colors.textMuted" fontSize="22" />
      </Element>

      <!-- List -->
      <Element
        x="16"
        :y="$listY"
        :w="$w - 32"
        :h="$listH"
      >
        <Element
          :for="(item, index) in $view"
          :key="$item.id"
          :x="0"
          :y="$index * 88"
          :w="$w - 32"
          h="80"
        >
          <Element
            :w="$w - 32" h="80"
            :color="$rowColor($item, $index)"
            :alpha="$rowAlpha($index)"
            :shader="{ type: 'RoundedRectangle', radius: 12 }"
          />
          <Text x="16" y="14" :content="$item.title || 'Untitled'" :color="$theme.colors.text" fontSize="24" />
          <Text x="16" y="46" :content="$time($item.updatedAt)" :color="$theme.colors.textMuted" fontSize="20" />
        </Element>
      </Element>
    </Element>
  `,
  computed: {
    $theme() {
      const { getSafeTheme } = require('../theme.js')
      return getSafeTheme(this, /*logWhenMissing*/ true)
    },
    $w() { return 560 },
    $h() { return 980 },
    $listY() { return 136 },
    $listH() { return this.$h - this.$listY - 16 },
    $items() { return Array.isArray(this.items) ? this.items : [] },
    $view() { return Array.isArray(this.view) ? this.view : [] },
    $searchLabel() {
      return this.q ? `Search: ${this.q}` : 'Search by title (type to filter)'
    }
  },
  methods: {
    refresh() {
      try {
        const all = NoteService.getNotes()
        this.items = Array.isArray(all) ? all : []
        this.applyFilter()
      } catch (e) {
        console.error('NotesList.refresh error', e)
      }
    },
    applyFilter() {
      try {
        this.view = NoteService.searchNotes(this.q) || []
        const idx = this.view.findIndex(n => n.id === this.selectedId)
        this.focusIndex = idx >= 0 ? idx : 0
        this.ensureOnSelect()
      } catch (e) {
        console.error('NotesList.applyFilter error', e)
      }
    },
    ensureOnSelect() {
      const arr = Array.isArray(this.view) ? this.view : []
      const item = arr[this.focusIndex]
      if (item && typeof this.onSelect === 'function') this.onSelect(item)
    },
    // PUBLIC_INTERFACE
    setQuery(q) {
      /** Updates search query and re-filters list. */
      this.q = q
      this.applyFilter()
    },
    // PUBLIC_INTERFACE
    createNew() {
      /** Creates a new note and selects it. */
      const n = NoteService.createNote('Untitled', '')
      this.refresh()
      const idx = this.view.findIndex(x => x.id === n.id)
      this.focusIndex = idx >= 0 ? idx : 0
      this.ensureOnSelect()
      this.onCreate && this.onCreate(n)
    },
    // PUBLIC_INTERFACE
    focusNext() {
      /** Move focus down the list. */
      if (this.view.length === 0) return
      this.focusIndex = Math.min(this.focusIndex + 1, this.view.length - 1)
      this.ensureOnSelect()
    },
    // PUBLIC_INTERFACE
    focusPrev() {
      /** Move focus up the list. */
      if (this.view.length === 0) return
      this.focusIndex = Math.max(this.focusIndex - 1, 0)
      this.ensureOnSelect()
    },
    $rowColor(item, index) {
      const selected = this.view[index]?.id === this.selectedId
      return selected ? this.$theme.colors.primary : this.$theme.colors.surfaceAlt
    },
    $rowAlpha(index) {
      const selected = this.view[index]?.id === this.selectedId
      return selected ? 0.18 : 1
    },
    $time(iso) {
      if (!iso) return ''
      const d = new Date(iso)
      return `Edited ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
    }
  },
  input: {
    up() { this.focusPrev() },
    down() { this.focusNext() },
    left() { /* bubble to parent if needed */ this.parent?.focus?.() },
    right() { this.parent?.focus?.() },
    enter() { this.ensureOnSelect?.() },
    back() { /* no-op */ },
    // typing for search
    key(e) {
      const ch = e?.key || ''
      if (ch === 'Backspace') {
        this.setQuery(this.q.slice(0, -1))
      } else if (ch && ch.length === 1) {
        this.setQuery((this.q || '') + ch)
      } else if (typeof ch === 'string' && ch.toLowerCase() === 'n') {
        this.createNew()
      }
    }
  }
})
