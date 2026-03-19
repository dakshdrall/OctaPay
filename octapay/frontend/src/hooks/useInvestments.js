import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function useInvestments() {
  const { authFetch } = useAuth()
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await authFetch('/api/invest')
        if (!res.ok) throw new Error('Failed to fetch investments')
        const data = await res.json()
        setInvestments(data.investments ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvestments()
  }, [authFetch])

  return { investments, loading }
}
