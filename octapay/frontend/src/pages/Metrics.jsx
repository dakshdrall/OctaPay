import { useEffect, useState } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'https://octapay.onrender.com'

export default function Metrics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/api/metrics`)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-white">Loading metrics...</div>
  if (!data) return <div className="p-8 text-red-400">Failed to load metrics</div>

  const cards = [
    { label: 'Total Users', value: data.totalUsers },
    { label: 'DAU', value: data.dau },
    { label: 'MAU', value: data.mau },
    { label: 'Total Transactions', value: data.totalTransactions },
    { label: 'Transactions (7d)', value: data.weeklyTransactions },
    { label: 'Total Volume', value: `${Number(data.totalVolume).toFixed(2)} XLM` },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">📊 OctaPay Metrics</h1>
      <p className="text-gray-400 mb-8">Live platform statistics</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">{c.label}</p>
            <p className="text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-semibold mb-3">Transaction Breakdown</h2>
        {data.txByType.map(t => (
          <div key={t.type} className="flex justify-between py-1 border-b border-gray-700">
            <span className="text-gray-300">{t.type}</span>
            <span className="font-bold">{t._count.type}</span>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold mb-2">⚡ Fee Sponsor Wallet</h2>
        <p className="text-xs text-gray-400 break-all">{data.sponsorWallet}</p>
        
          <a href={`https://stellar.expert/explorer/testnet/account/${data.sponsorWallet}`}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 text-sm mt-2 inline-block hover:underline"
        >
          View on Stellar Explorer →
        </a>
      </div>
    </div>
  )
}
