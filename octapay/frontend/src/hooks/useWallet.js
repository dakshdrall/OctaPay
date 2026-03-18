import { useEffect, useState } from 'react'

export default function useWallet() {
  const [wallet, setWallet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await fetch('/api/wallet')
        const data = await res.json()
        setWallet(data.wallet)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWallet()
  }, [])

  return { wallet, loading }
}
