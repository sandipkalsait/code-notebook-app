import React from 'react'  
import { AuthProvider } from '@components/Auth/AuthContext'
import EmailForm from '@components/Auth/EmailForm'
import Dashboard from '@components/Dashboard/Dashboard'
import { useAuth } from '@hooks/useAuth'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return user ? <Dashboard /> : <EmailForm />
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AppContent />
      </div>
    </AuthProvider>
  )
}

export default App