import { readFile } from 'node:fs/promises'
import process from 'node:process'
import { cert, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp as initializeClientApp } from 'firebase/app'
import { addDoc, collection, getFirestore as getClientFirestore } from 'firebase/firestore'

const TOTAL_PRODUCTS = 100
const CATEGORIES = ['watches', 'caps', 'mens-fashion', 'womens-fashion']

async function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
  }

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (!serviceAccountPath) {
    throw new Error(
      'Set FIREBASE_SERVICE_ACCOUNT_PATH (or FIREBASE_SERVICE_ACCOUNT_JSON) before seeding.',
    )
  }

  const fileContent = await readFile(serviceAccountPath, 'utf8')
  return JSON.parse(fileContent)
}

async function loadEnvFromDotLocal() {
  const envPath = process.env.ENV_FILE_PATH || '.env.local'
  const content = await readFile(envPath, 'utf8')
  const lines = content.split('\n')
  const vars = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    vars[key] = value
  }

  return vars
}

function createDummyProduct(index) {
  const category = CATEGORIES[index % CATEGORIES.length]
  const n = String(index + 1).padStart(3, '0')

  return {
    title: `Dummy Product ${n}`,
    category,
    details: `This is placeholder detail text for product ${n} in ${category}.`,
    imageUrl: 'https://example.com/placeholder-product-image.jpg',
    affiliateLink: `https://example.com/product-${n}`,
    price: `₹${(499 + index * 35).toLocaleString('en-IN')}`,
    order: index + 1,
  }
}

async function seedProducts() {
  try {
    const serviceAccount = await loadServiceAccount()
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID ?? serviceAccount.project_id

    if (!projectId) {
      throw new Error('Missing Firebase project id. Set VITE_FIREBASE_PROJECT_ID in env.')
    }

    initializeApp({
      credential: cert(serviceAccount),
      projectId,
    })

    const db = getFirestore()
    const batch = db.batch()

    for (let i = 0; i < TOTAL_PRODUCTS; i += 1) {
      const docRef = db.collection('products').doc()
      batch.set(docRef, createDummyProduct(i))
    }

    await batch.commit()
    console.log(`Added ${TOTAL_PRODUCTS} dummy products to "products" collection (admin mode).`)
    return
  } catch {
    const env = await loadEnvFromDotLocal()
    const clientConfig = {
      apiKey: env.VITE_FIREBASE_API_KEY,
      authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.VITE_FIREBASE_APP_ID,
      measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
    }

    if (!clientConfig.apiKey || !clientConfig.projectId || !clientConfig.appId) {
      throw new Error(
        'Firebase client config missing. Add values to .env.local or use service account env.',
      )
    }

    const app = initializeClientApp(clientConfig)
    const db = getClientFirestore(app)
    const productsCollection = collection(db, 'products')

    for (let i = 0; i < TOTAL_PRODUCTS; i += 1) {
      await addDoc(productsCollection, createDummyProduct(i))
    }

    console.log(`Added ${TOTAL_PRODUCTS} dummy products to "products" collection (client mode).`)
  }
}

seedProducts().catch((error) => {
  console.error('Failed to seed products:', error.message)
  process.exit(1)
})
