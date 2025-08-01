import React from 'react'

const EmptyState = () => {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
        Get started by creating your first note. Click the "New Note" button to begin.
      </p>
      <div className="inline-flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Tip: Use Ctrl+Enter to quickly save notes
      </div>
    </div>
  )
}

export default EmptyState