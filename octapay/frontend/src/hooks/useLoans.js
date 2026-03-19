import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useLoans() {
  const { authFetch } = useAuth()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLoans = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authFetch('/api/borrow')
      if (!res.ok) throw new Error('Failed to fetch loans')
      const data = await res.json()
      setLoans(data.loans ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  return { loans, loading, refresh: fetchLoans }
}
