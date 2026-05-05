export type CategoryId =
  | 'watches'
  | 'caps'
  | 'mens-fashion'
  | 'womens-fashion'

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'watches', label: 'Watches' },
  { id: 'caps', label: 'Caps' },
  { id: 'mens-fashion', label: "Men's Fashion" },
  { id: 'womens-fashion', label: "Women's Fashion" },
]

export const CATEGORY_IDS = new Set<CategoryId>(
  CATEGORIES.map((c) => c.id),
)

export function parseCategory(value: unknown): CategoryId | null {
  if (typeof value !== 'string') return null
  return CATEGORY_IDS.has(value as CategoryId) ? (value as CategoryId) : null
}
