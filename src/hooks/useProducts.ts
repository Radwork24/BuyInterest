import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db, firebaseConfigured } from '../lib/firebase'
import type { Product } from '../types/product'
import { parseCategory } from '../types/catalog'

function docToProduct(id: string, data: Record<string, unknown>): Product | null {
  const category = parseCategory(data.category)
  if (!category) return null

  const price = typeof data.price === 'string' ? data.price : ''
  const details = typeof data.details === 'string' ? data.details : ''
  const affiliateLink = typeof data.affiliateLink === 'string' ? data.affiliateLink : ''
  const imageUrl = typeof data.imageUrl === 'string' ? data.imageUrl : ''
  const title = typeof data.title === 'string' ? data.title : undefined
  const order = typeof data.order === 'number' ? data.order : undefined

  if (!price || !affiliateLink) return null

  return {
    id,
    category,
    price,
    details,
    affiliateLink,
    imageUrl,
    title,
    order,
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(() => firebaseConfigured)
  const [error, setError] = useState<string | null>(() =>
    firebaseConfigured
      ? null
      : 'Add Firebase keys to .env.local (see .env.example). Restart npm run dev.',
  )

  useEffect(() => {
    if (!firebaseConfigured || !db) return

    const col = collection(db, 'products')
    const unsub = onSnapshot(
      col,
      (snap) => {
        const list: Product[] = []
        snap.forEach((doc) => {
          const p = docToProduct(doc.id, doc.data() as Record<string, unknown>)
          if (p) list.push(p)
        })
        list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        setProducts(list)
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      },
    )

    return () => unsub()
  }, [])

  return { products, loading, error }
}
