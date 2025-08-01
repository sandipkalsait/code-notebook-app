import { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

let app
let db

export const useFirebase = () => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!app) {
      try {
        app = initializeApp(firebaseConfig)
        db = getFirestore(app)
        setIsInitialized(true)
      } catch (error) {
        console.error('Firebase initialization error:', error)
      }
    } else {
      setIsInitialized(true)
    }
  }, [])

  return { db, isInitialized }
}