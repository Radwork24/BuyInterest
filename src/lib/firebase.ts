import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

let app: FirebaseApp | undefined
let db: Firestore | undefined
let storage: FirebaseStorage | undefined

if (firebaseConfigured) {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  storage = getStorage(app)
}

export { app, db, storage }

/** Safe to call once from main.tsx; returns null if unsupported or not configured. */
export async function initAnalytics(): Promise<Analytics | null> {
  if (!app || !firebaseConfig.measurementId) return null
  if (!(await isSupported())) return null
  return getAnalytics(app)
}
