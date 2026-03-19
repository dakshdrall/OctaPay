import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useWallet() {
  const { authFetch } = useAuth()
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async () => {
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
    }

    fetchWallet()
  }, [authFetch])

  return { wallet, loading }
}
