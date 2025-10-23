Ocean Notes (LightningJS / Blits)
- Create, view, edit, delete notes with autosave and search.
- Local persistence using localStorage.

Run
- npm install
- npm run dev (served on port 3000 via Vite preview in this environment)

Layout
- Header with app title and subtitle.
- Left: Notes list with search (type to filter), N to create.
- Right: Editor with title and content fields, autosaves on typing, Delete key to remove.

Keyboard
- Arrow Up/Down: Move selection in list.
- N: New note.
- F: Focus list/search typing.
- E: Focus editor content.
- Tab: Toggle between title and content fields in editor.
- Delete: Open delete confirmation dialog.
- Escape: Close dialogs/back.
