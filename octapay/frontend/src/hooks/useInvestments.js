import { useEffect, useState } from 'react'

export default function useInvestments() {
  const [investments, setInvestments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await fetch('/api/invest')
        const data = await res.json()
        setInvestments(data.investments ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchInvestments()
  }, [])

  return { investments, loading }
}
