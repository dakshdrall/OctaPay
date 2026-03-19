import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useWallet() {
  const { authFetch } = useAuth()
  const [balance, setBalance] = useState(0)
  const [publicKey, setPublicKey] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchBalance = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await authFetch('/api/wallet/balance')
      if (!res.ok) throw new Error('Failed to fetch balance')
      const data = await res.json()
      setBalance(data.balance ?? 0)
      setPublicKey(data.publicKey)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    fetchBalance()
    const interval = setInterval(fetchBalance, 30_000)
    return () => clearInterval(interval)
  }, [fetchBalance])

  return { balance, publicKey, loading, error, refresh: fetchBalance }
}
