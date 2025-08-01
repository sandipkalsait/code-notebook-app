import React, { useState } from 'react'
import { useAuth } from '@hooks/useAuth'

const EmailForm = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)

    // Simulate loading for better UX
    setTimeout(() => {
      login(email.toLowerCase())
      setIsLoading(false)
    }, 800)
  }

  const isValidEmail = email.includes('@') && email.includes('.')

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-xl flex items-center justify-center mb-6 animate-scale-in">
             <div className="app-logo">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14,2 14,8 20,8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10,9 9,9 8,9"></polyline>
                    </svg>
                </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Code Notebook</h1>
          <p className="text-gray-600">Enter your email to access your personal notes</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
              placeholder="Enter your email address"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!isValidEmail || isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-primary-600 text-sm font-medium rounded-lg text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-700 mr-2"></div>
                Accessing Notes...
              </div>
            ) : (
              'Access My Notes'
            )}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          <p>No password required • Your notes are stored securely</p>
        </div>
      </div>
    </div>
  )
}

export default EmailForm