import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useWallet() {
  const { authFetch } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchWallet = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authFetch('/api/wallet')
      if (!res.ok) throw new Error('Failed to fetch wallet')
      const data = await res.json()
      setWallet(data.wallet)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    fetchWallet()
  }, [fetchWallet])

  return { wallet, loading, refresh: fetchWallet }
}
