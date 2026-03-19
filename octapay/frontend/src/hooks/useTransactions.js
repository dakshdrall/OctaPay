import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useTransactions() {
  const { authFetch } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authFetch('/api/transactions')
      if (!res.ok) throw new Error('Failed to fetch transactions')
      const data = await res.json()
      setTransactions(data.transactions ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return { transactions, loading, refresh: fetchTransactions }
}
