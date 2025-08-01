import React from 'react'
import NoteCard from '@components/Notes/NoteCard'
import EmptyState from '@components/Notes/EmptyState'
import LoadingSpinner from '@components/Common/LoadingSpinner'

const NotesGrid = ({ notes, loading, onEditNote, onDeleteNote }) => {
  if (loading) {
    return <LoadingSpinner />
  }

  if (notes.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {notes.map((note, index) => (
        <div
          key={note.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <NoteCard
            note={note}
            onEdit={() => onEditNote(note)}
            onDelete={() => onDeleteNote(note.id)}
          />
        </div>
      ))}
    </div>
  )
}

export default NotesGrid