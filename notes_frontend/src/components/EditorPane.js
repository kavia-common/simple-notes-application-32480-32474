import Blits from '@lightningjs/blits'
import NoteService from '../services/NoteService.js'

export default Blits.Component('EditorPane', {
  props: ['note'],
  state() {
    return {
      localTitle: this.note?.title || '',
      localContent: this.note?.content || '',
      lastSavedAt: this.note?.updatedAt || '',
      showConfirm: false,
      cursor: 'title' // 'title' or 'content'
    }
  },
  watch: {
    note(n) {
      // Sync when a new note is selected
      this.localTitle = n?.title || ''
      this.localContent = n?.content || ''
      this.lastSavedAt = n?.updatedAt || ''
    }
  },
  template: `
    <Element :w="$w" :h="$h">
      <!-- Card -->
      <Element :w="$w" :h="$h" :color="$theme.colors.surface" :shader="{ type: 'RoundedRectangle', radius: 16 }" />
      <!-- Header -->
      <Element x="24" y="16" :w="$w - 48" h="56">
        <Text :content="'Editor'" :color="$theme.colors.text" fontSize="28" />
        <Text x="0" y="32" :content="$subtitle" :color="$theme.colors.textMuted" fontSize="20" />
      </Element>

      <!-- Title field -->
      <Element x="24" y="96" :w="$w - 48" h="64">
        <Element :w="$w - 48" h="64" :color="$titleBg" :shader="{ type: 'RoundedRectangle', radius: 12 }" />
        <Text x="16" y="18" :content="$titleDisplay" :color="$theme.colors.text" fontSize="26" />
      </Element>

      <!-- Content field area -->
      <Element x="24" y="176" :w="$w - 48" :h="$h - 268">
        <Element :w="$w - 48" :h="$h - 268" :color="$contentBg" :shader="{ type: 'RoundedRectangle', radius: 12 }" />
        <Text x="16" y="16" :content="$contentDisplay" :color="$theme.colors.text" fontSize="22" :maxLines="$maxLines" :w="$w - 80" />
      </Element>

      <!-- Footer actions -->
      <Element x="24" :y="$h - 76" :w="$w - 48" h="52">
        <Text :content="$savedText" :color="$theme.colors.textMuted" fontSize="18" />
        <Element :x="$w - 200" y="0" w="180" h="52">
          <Element
            :w="180" h="52"
            :color="$theme.colors.error"
            :shader="{ type: 'RoundedRectangle', radius: 12 }"
            @enter="$onDelete"
          />
          <Text x="90" y="14" mountX="0.5" :content="'Delete (Del)'" :color="$theme.colors.surface" fontSize="22" />
        </Element>
      </Element>

      <!-- Confirm dialog -->
      <Element v-if="$showConfirm" :x="$w/2 - 240" :y="$h/2 - 120" w="480" h="200">
        <Element :w="480" h="200" :color="$theme.colors.surface" :shader="{ type: 'RoundedRectangle', radius: 16 }" />
        <Element :w="480" h="200" :color="$theme.colors.shadow" :alpha="0.05" />
        <Text x="24" y="24" :content="'Delete note?'" :color="$theme.colors.text" fontSize="28" />
        <Text x="24" y="70" :content="'This action cannot be undone.'" :color="$theme.colors.textMuted" fontSize="22" />
        <Element x="24" y="134" w="200" h="52" @enter="$confirmDelete(false)">
          <Element :w="200" h="52" :color="$theme.colors.surfaceAlt" :shader="{ type: 'RoundedRectangle', radius: 12 }" />
          <Text x="100" y="14" mountX="0.5" :content="'Cancel (Esc)'" :color="$theme.colors.text" fontSize="22" />
        </Element>
        <Element x="256" y="134" w="200" h="52" @enter="$confirmDelete(true)">
          <Element :w="200" h="52" :color="$theme.colors.error" :shader="{ type: 'RoundedRectangle', radius: 12 }" />
          <Text x="100" y="14" mountX="0.5" :content="'Delete'" :color="$theme.colors.surface" fontSize="22" />
        </Element>
      </Element>
    </Element>
  `,
  computed: {
    $theme() { return this.app.$theme },
    $w() { return 1320 },
    $h() { return 980 },
    $subtitle() {
      if (!this.note) return 'Select or create a note to begin.'
      const d = new Date(this.note.updatedAt || Date.now())
      return `Autosaves • Last edited ${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
    },
    $titleDisplay() {
      return this.localTitle || 'Untitled'
    },
    $contentDisplay() {
      return this.localContent || 'Start typing...'
    },
    $savedText() {
      if (!this.lastSavedAt) return ''
      const d = new Date(this.lastSavedAt)
      return `Saved ${d.toLocaleTimeString()}`
    },
    $titleBg() {
      return this.cursor === 'title' ? this.$theme.colors.bg : this.$theme.colors.surfaceAlt
    },
    $contentBg() {
      return this.cursor === 'content' ? this.$theme.colors.bg : this.$theme.colors.surfaceAlt
    },
    $showConfirm() { return this.showConfirm },
    $maxLines() { return 18 }
  },
  methods: {
    autosave() {
      if (!this.note) return
      const updated = NoteService.updateNote(this.note.id, {
        title: this.localTitle,
        content: this.localContent
      })
      if (updated) {
        this.lastSavedAt = updated.updatedAt
        // propagate to parent so list refreshes ordering
        this.parent?.$emit?.('note-updated', updated)
      }
    },
    // PUBLIC_INTERFACE
    focusTitle() { this.cursor = 'title' },
    // PUBLIC_INTERFACE
    focusContent() { this.cursor = 'content' },
    // PUBLIC_INTERFACE
    $onDelete() {
      if (!this.note) return
      this.showConfirm = true
    },
    // PUBLIC_INTERFACE
    $confirmDelete(ok) {
      if (!this.note) { this.showConfirm = false; return }
      if (ok) {
        const id = this.note.id
        NoteService.deleteNote(id)
        this.showConfirm = false
        this.parent?.$emit?.('note-deleted', { id })
      } else {
        this.showConfirm = false
      }
    }
  },
  input: {
    up() { /* not used in editor */ },
    down() { /* not used in editor */ },
    left() { this.parent?.focus?.() },
    right() { this.parent?.focus?.() },
    enter() { /* accept */ },
    back() { if (this.showConfirm) this.$confirmDelete(false) },
    key(e) {
      if (!this.note) return
      const key = e?.key || ''
      if (key === 'Delete') {
        this.$onDelete()
        return
      }
      if (key === 'Tab') {
        this.cursor = this.cursor === 'title' ? 'content' : 'title'
        return
      }
      if (key === 'Escape') {
        if (this.showConfirm) this.$confirmDelete(false)
        return
      }
      // Basic text input simulation
      if (key === 'Backspace') {
        if (this.cursor === 'title') this.localTitle = this.localTitle.slice(0, -1)
        else this.localContent = this.localContent.slice(0, -1)
        this.autosave()
      } else if (key.length === 1) {
        if (this.cursor === 'title') {
          this.localTitle += key
        } else {
          this.localContent += key
        }
        this.autosave()
      } else if (key === 'Enter') {
        if (this.cursor === 'content') {
          this.localContent += '\n'
          this.autosave()
        }
      }
    }
  }
})
