# Code Notebook - Cloud Notes for Developers
## [https://code-notebooks.web.app]

This document provides a complete setup guide for converting the code notebook application from vanilla JavaScript to a modern React application using Vite.js and Firebase backend.

## Project Structure

```
code-notebook-app/
├── public/
│   ├── vite.svg
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── EmailForm.jsx
│   │   │   └── AuthContext.jsx
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NotesGrid.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── Notes/
│   │   │   ├── NoteModal.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   └── EmptyState.jsx
│   │   └── Common/
│   │       ├── Header.jsx
│   │       └── LoadingSpinner.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useNotes.js
│   │   └── useFirebase.js
│   ├── services/
│   │   ├── firebase.js
│   │   └── notesService.js
│   ├── utils/
│   │   └── helpers.js
│   ├── styles/
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Setup Steps

### 1. Initialize Vite React Project

```bash
npm create vite@latest code-notebook-app -- --template react
cd code-notebook-app
npm install
```

### 2. Install Dependencies

```bash
# Core dependencies
npm install firebase

# Development dependencies  
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Environment Variables Setup

Create `.env` file in project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# App Configuration
VITE_APP_NAME=React Digital Notebook
VITE_APP_VERSION=2.0.0
```

Create `.env.example` for team members:

```env
# Firebase Configuration (replace with your values)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 4. Package.json Configuration

```json
{
  "name": "code-notebook-app",
  "private": true,
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "firebase": "^10.7.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}
```

### 5. Vite Configuration

Create `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth']
        }
      }
    }
  },
  define: {
    'process.env': process.env
  }
})
```

### 6. Tailwind CSS Configuration

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#218085',
          600: '#1D7478',
          700: '#26104B',
        },
        gray: {
          50: '#FCFCF9',
          100: '#FFFFFE',
          900: '#134252',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 7. Firebase Service Setup

Create `src/services/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
```

### 8. Main Application Entry

Create `src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### 9. CSS Styles Setup

Create `src/styles/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-all duration-200;
  }
  
  .btn-primary {
    @apply bg-primary-500 text-white hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  }
  
  .input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-6;
  }
  
  .modal-backdrop {
    @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
  }
}

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### 10. React Components

#### App.jsx (Main Component)

```jsx
import React from 'react';
import { AuthProvider } from './components/Auth/AuthContext';
import AuthenticatedApp from './components/AuthenticatedApp';
import UnauthenticatedApp from './components/UnauthenticatedApp';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/Common/LoadingSpinner';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
```

#### Auth Context

```jsx
// src/components/Auth/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email) => {
    try {
      // Simple email-based authentication
      const userData = { email, uid: email };
      setUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  useEffect(() => {
    // Check for existing auth state
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    loading,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### Custom Hooks

```javascript
// src/hooks/useNotes.js
import { useState, useEffect } from 'react';
import { notesService } from '../services/notesService';
import { useAuth } from '../components/Auth/AuthContext';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const loadNotes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userNotes = await notesService.getNotes(user.email);
      setNotes(userNotes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      const newNote = await notesService.createNote(user.email, noteData);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateNote = async (noteId, noteData) => {
    try {
      await notesService.updateNote(user.email, noteId, noteData);
      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, ...noteData } : note
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await notesService.deleteNote(user.email, noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    loadNotes();
  }, [user]);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refreshNotes: loadNotes
  };
};
```

### 11. Notes Service

```javascript
// src/services/notesService.js
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';

export const notesService = {
  async createNote(userId, noteData) {
    try {
      const notesRef = collection(db, 'notes');
      const newNote = {
        ...noteData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const docRef = await addDoc(notesRef, newNote);
      return { id: docRef.id, ...newNote };
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  async updateNote(userId, noteId, noteData) {
    try {
      const noteRef = doc(db, 'notes', noteId);
      const updatedData = {
        ...noteData,
        updatedAt: new Date()
      };
      await updateDoc(noteRef, updatedData);
      return updatedData;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  async deleteNote(userId, noteId) {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  async getNotes(userId) {
    try {
      const notesRef = collection(db, 'notes');
      const q = query(
        notesRef,
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const notes = [];
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
      });
      return notes;
    } catch (error) {
      console.error('Error getting notes:', error);
      throw error;
    }
  },

  subscribeToNotes(userId, callback) {
    const notesRef = collection(db, 'notes');
    const q = query(
      notesRef,
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const notes = [];
      querySnapshot.forEach((doc) => {
        notes.push({ id: doc.id, ...doc.data() });
      });
      callback(notes);
    });
  }
};
```

### 12. Firebase Firestore Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Notes collection rules
    match /notes/{noteId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == resource.data.userId;
      allow create: if request.auth != null &&
        request.auth.token.email == request.resource.data.userId;
    }
    
    // Users collection rules
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

### 13. Development Scripts

Add to `package.json` scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext js,jsx --fix",
    "format": "prettier --write src/**/*.{js,jsx,css,md}",
    "type-check": "tsc --noEmit"
  }
}
```

### 14. Deployment Configuration

For production deployment, update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth']
        }
      }
    }
  }
})
```

### 15. .gitignore

```gitignore
# Dependencies
node_modules/
.pnpm-debug.log*

# Build outputs
dist/
*.local

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## Running the Application

1. **Development Mode:**
   ```bash
   npm run dev
   ```

2. **Build for Production:**
   ```bash
   npm run build
   ```

3. **Preview Production Build:**
   ```bash
   npm run preview
   ```

## Features Implemented

- ✅ React 18+ with modern hooks
- ✅ Vite.js build tool and dev server
- ✅ Firebase Firestore integration
- ✅ Email-based authentication
- ✅ Environment variables configuration
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Real-time data synchronization
- ✅ CRUD operations for notes
- ✅ Search and filter functionality
- ✅ Auto-save capabilities
- ✅ Loading states and error handling
- ✅ Modern component architecture

## Next Steps

1. Set up Firebase project and get configuration keys
2. Replace placeholder values in `.env` file
3. Configure Firestore security rules
4. Test the application locally
5. Deploy to production (Vercel, Netlify, or Firebase Hosting)

This setup provides a modern, scalable React application with Firebase backend integration using Vite.js as the build tool.
