const STORAGE_KEY = 'notes.app.v1'

// PRIVATE helpers
const nowISO = () => new Date().toISOString()
const newId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
}

// PUBLIC_INTERFACE
function getNotes() {
  /** Returns all notes sorted by updatedAt desc. */
  const notes = readAll()
  return notes.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))
}

// PUBLIC_INTERFACE
function searchNotes(q) {
  /** Search notes by title case-insensitively. */
  const all = getNotes()
  const term = (q || '').trim().toLowerCase()
  if (!term) return all
  return all.filter(n => (n.title || '').toLowerCase().includes(term))
}

// PUBLIC_INTERFACE
function getNote(id) {
  /** Returns a single note by id or null. */
  return readAll().find(n => n.id === id) || null
}

// PUBLIC_INTERFACE
function createNote(title = 'Untitled', content = '') {
  /** Creates a new note with timestamps. */
  const n = {
    id: newId(),
    title,
    content,
    createdAt: nowISO(),
    updatedAt: nowISO()
  }
  const all = readAll()
  all.push(n)
  writeAll(all)
  return n
}

// PUBLIC_INTERFACE
function updateNote(id, patch) {
  /** Partially updates a note by id and returns updated note. */
  const all = readAll()
  const idx = all.findIndex(n => n.id === id)
  if (idx === -1) return null
  const updated = { ...all[idx], ...patch, updatedAt: nowISO() }
  all[idx] = updated
  writeAll(all)
  return updated
}

// PUBLIC_INTERFACE
function deleteNote(id) {
  /** Deletes a note by id. Returns true if deleted. */
  const all = readAll()
  const filtered = all.filter(n => n.id !== id)
  const changed = filtered.length !== all.length
  if (changed) writeAll(filtered)
  return changed
}

export default {
  getNotes,
  searchNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
}
