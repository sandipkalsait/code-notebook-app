import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth'
import { RecaptchaVerifier } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)


// Initialize Realtime Database
export const db = getDatabase(app)

// Initialize Firestore
export const firestore = getFirestore(app)

// Initialize Auth
export const auth = getAuth(app)

// Anonymous login
export const signInAnon = () => signInAnonymously(auth)

// Listen for auth state changes
export const onAuthChange = (callback) => onAuthStateChanged(auth, callback)

// Initialize and return a reCAPTCHA verifier
// Usage: const recaptchaVerifier = getRecaptchaVerifier('recaptcha-container')
export const getRecaptchaVerifier = (containerId, options = {}) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
      size: options.size || 'invisible',
      callback: options.callback || (() => {}),
      'expired-callback': options.expiredCallback || (() => {})
    }, auth)
    window.recaptchaVerifier.render()
  }
  return window.recaptchaVerifier
}

export default app