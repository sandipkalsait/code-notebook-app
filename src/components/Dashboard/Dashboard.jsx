import React, { useState } from 'react'
import Header from '@components/Common/Header'
import NotesGrid from './NotesGrid'
import SearchBar from './SearchBar'
import NoteModal from '@components/Notes/NoteModal'
import { useNotes } from '@hooks/useNotes'

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes()

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateNote = () => {
    setEditingNote(null)
    setIsModalOpen(true)
  }

  const handleEditNote = (note) => {
    setEditingNote(note)
    setIsModalOpen(true)
  }

  const handleSaveNote = async (noteData) => {
    if (editingNote) {
      await updateNote(editingNote.id, noteData)
    } else {
      await createNote(noteData)
    }
    setIsModalOpen(false)
    setEditingNote(null)
  }

  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId)
  }

  return (
    <div className="min-h-screen">
      <Header onCreateNote={handleCreateNote} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            notesCount={filteredNotes.length}
          />
        </div>

        <NotesGrid
          notes={filteredNotes}
          loading={loading}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteNote}
        />
      </main>

      {isModalOpen && (
        <NoteModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingNote(null)
          }}
          onSave={handleSaveNote}
          note={editingNote}
        />
      )}
    </div>
  )
}

export default Dashboard