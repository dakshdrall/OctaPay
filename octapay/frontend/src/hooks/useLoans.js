import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useLoans() {
  const { authFetch } = useAuth()
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoans = async () => {
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
    }

    fetchLoans()
  }, [authFetch])

  return { loans, loading }
}
