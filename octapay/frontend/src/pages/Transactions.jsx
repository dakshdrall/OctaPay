import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import TransactionRow from '../components/TransactionRow'

const TYPE_OPTIONS = ['all', 'investment', 'investment_withdraw', 'loan_disbursement', 'loan_repayment', 'send_usdc']

const typeLabel = (type) => {
  if (type === 'all') return 'All'
  return type.replace(/_/g, ' ').replace(/\b\w/g, (x) => x.toUpperCase())
}

export default function Transactions() {
  const { authFetch } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [selectedType, setSelectedType] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTransactions = async (pageValue) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authFetch(`/api/transactions?page=${pageValue}&limit=${limit}`)
      if (!res.ok) throw new Error('Failed to load transactions')
      const data = await res.json()
      setTransactions(data.transactions ?? [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
      setPage(data.page || 1)
    } catch (err) {
      setError(err.message || 'Unexpected error')
      setTransactions([])
      setTotal(0)
      setPages(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions(page)
  }, [page, limit])

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = selectedType === 'all' || tx.type === selectedType
      const matchesSearch = search
        ? tx.type.toLowerCase().includes(search.toLowerCase()) ||
          (tx.txHash ?? '').toLowerCase().includes(search.toLowerCase()) ||
          String(tx.amount).includes(search)
        : true
      return matchesType && matchesSearch
    })
  }, [transactions, selectedType, search])

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Transaction History</h1>
            <p className="mt-1 text-slate-400">All your account events in one place with filter and paging.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => fetchTransactions(1)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Refresh
            </button>
          </div>
        </header>

        <section className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-slate-900/70 p-4">
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-slate-300">Type</span>
            <select
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {TYPE_OPTIONS.map((type) => (
                <option key={type} value={type}>
                  {typeLabel(type)}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col text-sm flex-1 min-w-[180px]">
            <span className="mb-1 text-slate-300">Search</span>
            <input
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type/txHash/amount"
            />
          </label>
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-slate-300">Per page</span>
            <select
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
            >
              {[10, 20, 30, 50].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </label>
        </section>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/20 px-4 py-3 text-sm text-rose-200">{error}</div>
        )}

        <div className="overflow-x-auto rounded-xl bg-slate-900/70">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Currency</th>
                <th className="py-3 px-3">Tx Hash</th>
                <th className="py-3 px-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <span>
            Showing {filtered.length} of {total} transactions (page {page} of {pages})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-slate-700 px-3 py-1 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
              disabled={page >= pages}
              className="rounded-lg border border-slate-700 px-3 py-1 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
