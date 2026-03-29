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

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'var(--surface)',
      padding: 'var(--spacing-3xl) var(--spacing-2xl)',
    },
    header: {
      marginBottom: 'var(--spacing-2xl)',
      animation: 'fadeInUp 600ms ease-out',
    },
    title: {
      fontSize: '2.5rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text)',
      marginBottom: 'var(--spacing-sm)',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      fontSize: '1rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    },
    controls: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-xl)',
      animation: 'fadeInUp 600ms ease-out 100ms forwards',
      opacity: 0,
    },
    controlGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)',
    },
    label: {
      fontSize: '0.75rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    select: {
      backgroundColor: 'var(--surface-2)',
      color: 'var(--text)',
      border: '1px solid hsl(220, 12%, 20%)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.9375rem',
      transition: 'all 300ms ease-out',
      outline: 'none',
    },
    input: {
      backgroundColor: 'var(--surface-2)',
      color: 'var(--text)',
      border: '1px solid hsl(220, 12%, 20%)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.9375rem',
      transition: 'all 300ms ease-out',
      outline: 'none',
    },
    refreshButton: {
      padding: 'var(--spacing-md) var(--spacing-lg)',
      backgroundColor: 'var(--cta)',
      color: 'var(--surface)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '0.9375rem',
      cursor: 'pointer',
      transition: 'all 300ms ease-out',
      alignSelf: 'flex-end',
      marginTop: 'auto',
    },
    errorBox: {
      padding: 'var(--spacing-md) var(--spacing-lg)',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      border: '1px solid rgba(255, 0, 0, 0.2)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--danger)',
      fontSize: '0.875rem',
      fontFamily: 'var(--font-mono)',
      marginBottom: 'var(--spacing-xl)',
      animation: 'fadeInUp 300ms ease-out',
    },
    tableWrapper: {
      backgroundColor: 'var(--surface-2)',
      border: '1px solid hsl(220, 12%, 20%)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      animation: 'fadeInUp 600ms ease-out 200ms forwards',
      opacity: 0,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.875rem',
    },
    thead: {
      backgroundColor: 'rgba(0, 255, 255, 0.05)',
      borderBottom: '2px solid hsl(220, 12%, 25%)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    th: {
      padding: 'var(--spacing-lg)',
      textAlign: 'left',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      color: 'var(--accent)',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      whiteSpace: 'nowrap',
    },
    tbody: {
    },
    tr: {
      borderBottom: '1px solid hsl(220, 12%, 20%)',
      transition: 'background-color 300ms ease-out',
    },
    td: {
      padding: 'var(--spacing-lg)',
      color: 'var(--text)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.8125rem',
    },
    stateMessage: {
      padding: 'var(--spacing-2xl)',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    },
    footer: {
      marginTop: 'var(--spacing-xl)',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--spacing-lg)',
      fontSize: '0.875rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    },
    pagination: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-md)',
    },
    paginationButton: (disabled) => ({
      padding: 'var(--spacing-md) var(--spacing-lg)',
      backgroundColor: 'var(--surface-2)',
      color: disabled ? 'var(--text-muted)' : 'var(--text)',
      border: '1px solid hsl(220, 12%, 20%)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-mono)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 300ms ease-out',
      opacity: disabled ? 0.5 : 1,
      fontSize: '0.875rem',
    }),
    '@media (max-width: 640px)': {
      container: {
        padding: 'var(--spacing-xl) var(--spacing-lg)',
      },
      title: {
        fontSize: '1.75rem',
      },
      controls: {
        gridTemplateColumns: '1fr',
      },
      table: {
        fontSize: '0.75rem',
      },
      th: {
        padding: 'var(--spacing-md)',
      },
      td: {
        padding: 'var(--spacing-md)',
      },
    },
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Transaction History</h1>
        <p style={styles.subtitle}>All your account events in one place with filtering and pagination</p>
      </header>

      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label style={styles.label}>Type</label>
          <select
            style={styles.select}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {typeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.controlGroup}>
          <label style={styles.label}>Search</label>
          <input
            style={styles.input}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type, hash, or amount"
          />
        </div>

        <div style={styles.controlGroup}>
          <label style={styles.label}>Per Page</label>
          <select
            style={styles.select}
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[10, 20, 30, 50].map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div style={styles.controlGroup}>
          <button
            style={styles.refreshButton}
            onClick={() => fetchTransactions(1)}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            ⟳ Refresh
          </button>
        </div>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead style={styles.thead}>
            <tr>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Currency</th>
              <th style={styles.th}>Tx Hash</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody style={styles.tbody}>
            {loading ? (
              <tr>
                <td colSpan={6} style={styles.stateMessage}>
                  Loading transactions...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={styles.stateMessage}>
                  No transactions found. Start by investing or borrowing!
                </td>
              </tr>
            ) : (
              filtered.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.footer}>
        <span>
          Showing {filtered.length} of {total} transactions (page {page} of {pages})
        </span>
        <div style={styles.pagination}>
          <button
            style={styles.paginationButton(page <= 1)}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            ← Prev
          </button>
          <span>{page} / {pages}</span>
          <button
            style={styles.paginationButton(page >= pages)}
            onClick={() => setPage((prev) => Math.min(pages, prev + 1))}
            disabled={page >= pages}
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  )
}
