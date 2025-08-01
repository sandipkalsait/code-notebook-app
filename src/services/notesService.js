import { ref, push, set, update, remove, get, query, orderByChild } from 'firebase/database'
import { db } from './firebase' // Ensure db is initialized with getDatabase()
import { generateId } from '@utils/helpers'

// Fallback to localStorage if Firebase is not available
const useFirebase = () => {
  return db && import.meta.env.VITE_FIREBASE_PROJECT_ID
}

// Sanitize userEmail for Firebase path
const sanitizeEmailForPath = (email) => {
  return email.replace(/[.#$\[\]]/g, '_')
}

const getNotesRef = (userEmail) => {
  const safeEmail = sanitizeEmailForPath(userEmail)
  return ref(db, `users/${safeEmail}/notes`)
}

class NotesService {
  async getNotes(userEmail) {
    if (useFirebase()) {
      try {
        const notesRef = getNotesRef(userEmail)
        const q = query(notesRef, orderByChild('createdAt'))
        const snapshot = await get(q)
        const notesObj = snapshot.val() || {}
        // Convert object to array and sort by createdAt desc
        const notes = Object.entries(notesObj).map(([id, note]) => ({
          id,
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }))
        return notes.sort((a, b) => b.createdAt - a.createdAt)
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error)
        return this.getNotesFromLocalStorage(userEmail)
      }
    } else {
      return this.getNotesFromLocalStorage(userEmail)
    }
  }

  async createNote(userEmail, noteData) {
    const now = new Date().toISOString()
    const note = {
      ...noteData,
      createdAt: now,
      updatedAt: now
    }

    if (useFirebase()) {
      try {
        const notesRef = getNotesRef(userEmail)
        const newNoteRef = push(notesRef)
        await set(newNoteRef, note)
        return {
          id: newNoteRef.key,
          ...note
        }
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error)
        return this.createNoteInLocalStorage(userEmail, note)
      }
    } else {
      return this.createNoteInLocalStorage(userEmail, note)
    }
  }

  async updateNote(userEmail, noteId, noteData) {
    const now = new Date().toISOString()
    const updates = {
      ...noteData,
      updatedAt: now
    }

    if (useFirebase()) {
      try {
        const safeEmail = sanitizeEmailForPath(userEmail)
        const noteRef = ref(db, `users/${safeEmail}/notes/${noteId}`)
        await update(noteRef, updates)
        return {
          id: noteId,
          ...updates
        }
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error)
        return this.updateNoteInLocalStorage(userEmail, noteId, updates)
      }
    } else {
      return this.updateNoteInLocalStorage(userEmail, noteId, updates)
    }
  }

  async deleteNote(userEmail, noteId) {
    if (useFirebase()) {
      try {
        const safeEmail = sanitizeEmailForPath(userEmail)
        const noteRef = ref(db, `users/${safeEmail}/notes/${noteId}`)
        await remove(noteRef)
        return true
      } catch (error) {
        console.error('Firebase error, falling back to localStorage:', error)
        return this.deleteNoteFromLocalStorage(userEmail, noteId)
      }
    } else {
      return this.deleteNoteFromLocalStorage(userEmail, noteId)
    }
  }

  // LocalStorage fallback methods remain unchanged
  getNotesFromLocalStorage(userEmail) {
    try {
      const notes = localStorage.getItem(`notes_${userEmail}`)
      return notes ? JSON.parse(notes).map(note => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      })) : []
    } catch (error) {
      console.error('LocalStorage error:', error)
      return []
    }
  }

  createNoteInLocalStorage(userEmail, noteData) {
    const notes = this.getNotesFromLocalStorage(userEmail)
    const newNote = {
      id: generateId(),
      ...noteData
    }

    const updatedNotes = [newNote, ...notes]
    localStorage.setItem(`notes_${userEmail}`, JSON.stringify(updatedNotes))
    return newNote
  }

  updateNoteInLocalStorage(userEmail, noteId, updates) {
    const notes = this.getNotesFromLocalStorage(userEmail)
    const noteIndex = notes.findIndex(note => note.id === noteId)

    if (noteIndex !== -1) {
      notes[noteIndex] = { ...notes[noteIndex], ...updates }
      localStorage.setItem(`notes_${userEmail}`, JSON.stringify(notes))
      return notes[noteIndex]
    }

    throw new Error('Note not found')
  }

  deleteNoteFromLocalStorage(userEmail, noteId) {
    const notes = this.getNotesFromLocalStorage(userEmail)
    const filteredNotes = notes.filter(note => note.id !== noteId)
    localStorage.setItem(`notes_${userEmail}`, JSON.stringify(filteredNotes))
    return true
  }
}

export const notesService = new NotesService()
