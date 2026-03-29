import { useState, useEffect } from 'react'

export default function Explorer() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      // Fetch all public keys
      const keysRes = await fetch('/api/wallet/public-keys')
      if (!keysRes.ok) throw new Error('Failed to fetch public keys')
      const { publicKeys } = await keysRes.json()

      // Fetch transactions for each public key
      const allTxs = []
      for (const publicKey of publicKeys) {
        const txs = await fetchAccountTransactions(publicKey)
        allTxs.push(...txs)
      }

      // Sort by date descending
      allTxs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      setTransactions(allTxs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchAccountTransactions = async (publicKey) => {
    const response = await fetch(`https://horizon-testnet.stellar.org/accounts/${publicKey}/transactions?limit=50&order=desc`)
    if (!response.ok) return []
    const data = await response.json()
    return data._embedded.records
  }

  if (loading) return <div className="min-h-screen bg-slate-950 text-white p-8">Loading transactions...</div>
  if (error) return <div className="min-h-screen bg-slate-950 text-white p-8">Error: {error}</div>

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Stellar Explorer - OctaPay Transactions</h1>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-slate-700">
          <thead>
            <tr className="bg-slate-800">
              <th className="border border-slate-700 px-4 py-2">Transaction Hash</th>
              <th className="border border-slate-700 px-4 py-2">From</th>
              <th className="border border-slate-700 px-4 py-2">To</th>
              <th className="border border-slate-700 px-4 py-2">Amount</th>
              <th className="border border-slate-700 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.hash} className="hover:bg-slate-800">
                <td className="border border-slate-700 px-4 py-2 font-mono text-sm">
                  <a href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                    {tx.hash.slice(0, 8)}...{tx.hash.slice(-8)}
                  </a>
                </td>
                <td className="border border-slate-700 px-4 py-2 font-mono text-sm">{tx.source_account}</td>
                <td className="border border-slate-700 px-4 py-2 font-mono text-sm">
                  {tx.operations && tx.operations.length > 0 && tx.operations[0].destination ? tx.operations[0].destination : 'N/A'}
                </td>
                <td className="border border-slate-700 px-4 py-2">
                  {tx.operations && tx.operations.length > 0 ? `${tx.operations[0].amount || 'N/A'} ${tx.operations[0].asset_type === 'native' ? 'XLM' : tx.operations[0].asset_code || 'N/A'}` : 'N/A'}
                </td>
                <td className="border border-slate-700 px-4 py-2">{new Date(tx.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}