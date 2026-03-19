import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useTransactions() {
  const { authFetch } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
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
    }

    fetchTransactions()
  }, [authFetch])

  return { transactions, loading }
}
