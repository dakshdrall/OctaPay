export const apiBaseUrl = import.meta.env.VITE_API_URL || ''

export async function fetchBalances() {
  const res = await fetch(`${apiBaseUrl}/api/wallet`)
  if (!res.ok) throw new Error('Failed to fetch wallet')
  return res.json()
}
