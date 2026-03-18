import { useEffect, useState } from 'react'

export default function useLoans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch('/api/borrow')
        const data = await res.json()
        setLoans(data.loans ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLoans()
  }, [])

  return { loans, loading }
}
