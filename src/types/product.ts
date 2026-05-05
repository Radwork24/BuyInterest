import type { CategoryId } from './catalog'

/** Fields you set in Firestore collection `products` (and image file in Storage). */
export type Product = {
  id: string
  /** Shown as image alt text */
  title?: string
  /** e.g. "$129" or "₹2,499" */
  price: string
  /** Short description; shown on card hover */
  details: string
  /** Outbound affiliate / product URL */
  affiliateLink: string
  /** Full download URL from Firebase Storage (or any HTTPS image URL) */
  imageUrl: string
  category: CategoryId
  /** Optional sort order (lower first). Omit on docs → treated as 0. */
  order?: number
}
