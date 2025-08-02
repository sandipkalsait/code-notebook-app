import { collection, addDoc, setDoc, updateDoc, deleteDoc, getDocs, doc, query, orderBy } from 'firebase/firestore'
import { firestore } from './firebase' // Use Firestore instance
import { generateId } from '@utils/helpers'

// Fallback to localStorage if Firebase is not available
const useFirestore = () => {
    return firestore && import.meta.env.VITE_FIREBASE_PROJECT_ID
}

// Sanitize userEmail for Firestore collection path
const sanitizeEmailForPath = (email) => {
    return email.replace(/[.#$\[\]]/g, '_')
}

const getNotesCollection = (userEmail) => {
    const safeEmail = sanitizeEmailForPath(userEmail)
    return collection(firestore, `users/${safeEmail}/notes`)
}

class NotesService {
    async getNotes(userEmail) {
        if (useFirestore()) {
            try {
                const notesCol = getNotesCollection(userEmail)
                const q = query(notesCol, orderBy('createdAt', 'desc'))
                const snapshot = await getDocs(q)
                const notes = snapshot.docs.map(docSnap => ({
                    id: docSnap.id,
                    ...docSnap.data(),
                    createdAt: new Date(docSnap.data().createdAt),
                    updatedAt: new Date(docSnap.data().updatedAt)
                }))
                return notes
            } catch (error) {
                console.error('Firestore error, falling back to localStorage:', error)
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

        if (useFirestore()) {
            try {
                const notesCol = getNotesCollection(userEmail)
                const docRef = await addDoc(notesCol, note)
                return {
                    id: docRef.id,
                    ...note
                }
            } catch (error) {
                console.error('Firestore error, falling back to localStorage:', error)
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

        if (useFirestore()) {
            try {
                const safeEmail = sanitizeEmailForPath(userEmail)
                const noteDoc = doc(firestore, `users/${safeEmail}/notes/${noteId}`)
                await updateDoc(noteDoc, updates)
                return {
                    id: noteId,
                    ...updates
                }
            } catch (error) {
                console.error('Firestore error, falling back to localStorage:', error)
                return this.updateNoteInLocalStorage(userEmail, noteId, updates)
            }
        } else {
            return this.updateNoteInLocalStorage(userEmail, noteId, updates)
        }
    }

    async deleteNote(userEmail, noteId) {
        if (useFirestore()) {
            try {
                const safeEmail = sanitizeEmailForPath(userEmail)
                const noteDoc = doc(firestore, `users/${safeEmail}/notes/${noteId}`)
                await deleteDoc(noteDoc)
                return true
            } catch (error) {
                console.error('Firestore error, falling back to localStorage:', error)
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