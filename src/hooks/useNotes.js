import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { notesService } from '@services/notesService2'

export const useNotes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadNotes = async () => {
    if (!user?.email) return

    setLoading(true)
    try {
      const userNotes = await notesService.getNotes(user.email)
      setNotes(userNotes)
    } catch (error) {
      console.error('Error loading notes:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadNotes()
  }, [user])

  const createNote = async (noteData) => {
    if (!user?.email) return

    try {
      const newNote = await notesService.createNote(user.email, noteData)
      setNotes(prev => [newNote, ...prev])
      return newNote
    } catch (error) {
      console.error('Error creating note:', error)
      throw error
    }
  }

  const updateNote = async (noteId, noteData) => {
    if (!user?.email) return

    try {
      const updatedNote = await notesService.updateNote(user.email, noteId, noteData)
      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ))
      return updatedNote
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  }

  const deleteNote = async (noteId) => {
    if (!user?.email) return

    try {
      await notesService.deleteNote(user.email, noteId)
      setNotes(prev => prev.filter(note => note.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  }

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: loadNotes
  }
}