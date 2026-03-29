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
      const keysRes = await fetch('/api/wallet/public-keys')
      if (!keysRes.ok) throw new Error('Failed to fetch public keys')
      const { publicKeys } = await keysRes.json()

      const allTxs = []
      for (const publicKey of publicKeys) {
        const txs = await fetchAccountTransactions(publicKey)
        allTxs.push(...txs)
      }

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

  const truncate = (str, len = 12) => {
    if (!str) return 'N/A'
    return str.length > len ? `${str.slice(0, len)}...` : str
  }

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
      display: 'flex',
      gap: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-xl)',
      animation: 'fadeInUp 600ms ease-out 100ms forwards',
      opacity: 0,
    },
    refreshButton: {
      padding: 'var(--spacing-md) var(--spacing-lg)',
      backgroundColor: 'var(--cta)',
      color: 'var(--surface)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 300ms ease-out',
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
    hash: {
      color: 'var(--accent)',
      fontWeight: 500,
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'all 300ms ease-out',
    },
    amount: {
      color: 'var(--cta)',
      fontWeight: 500,
    },
    date: {
      color: 'var(--text-muted)',
      fontSize: '0.75rem',
    },
    emptyState: {
      padding: 'var(--spacing-3xl) var(--spacing-2xl)',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    },
    loadingState: {
      padding: 'var(--spacing-3xl)',
      textAlign: 'center',
      color: 'var(--text-muted)',
    },
    errorState: {
      padding: 'var(--spacing-2xl)',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      border: '1px solid rgba(255, 0, 0, 0.2)',
      borderRadius: 'var(--radius-lg)',
      color: 'var(--danger)',
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.9375rem',
    },
    '@media (max-width: 640px)': {
      container: {
        padding: 'var(--spacing-xl) var(--spacing-lg)',
      },
      title: {
        fontSize: '1.75rem',
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
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Stellar Explorer</h1>
        <p style={styles.subtitle}>View all on-chain transactions from OctaPay wallets on the Stellar testnet</p>
      </header>

      <div style={styles.controls}>
        <button
          style={styles.refreshButton}
          onClick={fetchTransactions}
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

      {error ? (
        <div style={styles.errorState}>Error: {error}</div>
      ) : loading ? (
        <div style={styles.loadingState}>Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div style={styles.emptyState}>No transactions found</div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={styles.th}>Transaction Hash</th>
                <th style={styles.th}>From</th>
                <th style={styles.th}>To</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Asset</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody style={styles.tbody}>
              {transactions.map((tx, idx) => (
                <tr key={`${tx.hash}-${idx}`} style={styles.tr}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}>
                  <td style={styles.td}>
                    <a
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.hash}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'hsl(180, 100%, 55%)'
                        e.currentTarget.style.textDecoration = 'underline'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--accent)'
                        e.currentTarget.style.textDecoration = 'none'
                      }}
                    >
                      {truncate(tx.hash, 16)}
                    </a>
                  </td>
                  <td style={styles.td}>{truncate(tx.source_account, 14)}</td>
                  <td style={styles.td}>
                    {tx.operations && tx.operations.length > 0 && tx.operations[0].destination
                      ? truncate(tx.operations[0].destination, 14)
                      : 'N/A'}
                  </td>
                  <td style={{ ...styles.td, ...styles.amount }}>
                    {tx.operations && tx.operations.length > 0 && tx.operations[0].amount
                      ? `${parseFloat(tx.operations[0].amount).toFixed(4)}`
                      : 'N/A'}
                  </td>
                  <td style={styles.td}>
                    {tx.operations && tx.operations.length > 0
                      ? tx.operations[0].asset_type === 'native'
                        ? 'XLM'
                        : tx.operations[0].asset_code || 'N/A'
                      : 'N/A'}
                  </td>
                  <td style={{ ...styles.td, ...styles.date }}>
                    {new Date(tx.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}