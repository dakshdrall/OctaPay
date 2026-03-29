import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import useWallet from '../hooks/useWallet'
import useInvestments from '../hooks/useInvestments'
import useLoans from '../hooks/useLoans'
import useTransactions from '../hooks/useTransactions'
import WalletCard from '../components/WalletCard'
import LoanCard from '../components/LoanCard'
import TransactionRow from '../components/TransactionRow'
import PortfolioChart from '../components/PortfolioChart'

export default function Dashboard() {
  const { user } = useAuth()
  const { balance, loading: walletLoading } = useWallet()
  const { investments, loading: investLoading } = useInvestments()
  const { loans, loading: loansLoading } = useLoans()
  const { transactions, loading: txLoading } = useTransactions()

  const totalInvested = useMemo(() => {
    return investments.reduce((sum, inv) => sum + (inv.amount ?? 0), 0)
  }, [investments])

  const totalEarned = useMemo(() => {
    return investments.reduce((sum, inv) => {
      const apy = inv.apy ?? 0
      return sum + (inv.amount ?? 0) * (apy / 100)
    }, 0)
  }, [investments])

  const activeLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === 'active').length
  }, [loans])

  const loading = walletLoading || investLoading || loansLoading || txLoading

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'var(--surface)',
      padding: 'var(--spacing-3xl) var(--spacing-2xl)',
    },
    header: {
      marginBottom: 'var(--spacing-3xl)',
      animation: 'fadeInUp 600ms ease-out',
    },
    greeting: {
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
    gridLayout: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: 'var(--spacing-2xl)',
      alignItems: 'start',
    },
    leftColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-2xl)',
    },
    heroCard: {
      backgroundColor: 'var(--surface-2)',
      border: '1px solid hsl(220, 12%, 20%)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-2xl)',
      position: 'relative',
      overflow: 'hidden',
      animation: 'fadeInUp 600ms ease-out',
    },
    heroGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(0, 200, 255, 0.02) 100%)',
      pointerEvents: 'none',
    },
    heroContent: {
      position: 'relative',
      zIndex: 1,
    },
    heroLabel: {
      fontSize: '0.75rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: 'var(--spacing-md)',
    },
    heroAmount: {
      fontSize: '3rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      color: 'var(--accent)',
      marginBottom: 'var(--spacing-sm)',
      letterSpacing: '-0.01em',
    },
    heroCurrency: {
      fontSize: '1rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--spacing-lg)',
      marginTop: 'var(--spacing-2xl)',
      paddingTop: 'var(--spacing-2xl)',
      borderTop: '1px solid hsl(220, 12%, 20%)',
    },
    stat: (delay) => ({
      animation: `fadeInUp 600ms ease-out ${delay}ms forwards`,
      opacity: 0,
    }),
    statLabel: {
      fontSize: '0.7rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: 'var(--spacing-sm)',
    },
    statValue: {
      fontSize: '1.5rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      color: 'var(--text)',
      marginBottom: 'var(--spacing-xs)',
    },
    statUnit: {
      fontSize: '0.75rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    },
    actionsBar: {
      display: 'flex',
      gap: 'var(--spacing-lg)',
      marginTop: 'var(--spacing-2xl)',
      paddingTop: 'var(--spacing-xl)',
      borderTop: '1px solid hsl(220, 12%, 20%)',
      animation: 'fadeInUp 700ms ease-out',
    },
    button: (variant = 'primary') => ({
      flex: 1,
      padding: 'var(--spacing-md) var(--spacing-lg)',
      borderRadius: 'var(--radius-md)',
      border: variant === 'primary' ? 'none' : '1px solid hsl(220, 12%, 25%)',
      backgroundColor: variant === 'primary' ? 'var(--cta)' : 'transparent',
      color: variant === 'primary' ? 'var(--surface)' : 'var(--text)',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '0.9375rem',
      cursor: 'pointer',
      transition: 'all 300ms ease-out',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center',
    }),
    sectionTitle: {
      fontSize: '1.25rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text)',
      marginBottom: 'var(--spacing-lg)',
      letterSpacing: '-0.01em',
    },
    cardContainer: {
      backgroundColor: 'var(--surface-2)',
      border: '1px solid hsl(220, 12%, 20%)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-xl)',
      animation: 'fadeInUp 600ms ease-out 100ms forwards',
      opacity: 0,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '0.875rem',
    },
    thead: {
      borderBottom: '1px solid hsl(220, 12%, 25%)',
    },
    th: {
      padding: 'var(--spacing-md)',
      textAlign: 'left',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      color: 'var(--text-muted)',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    tbody: {
      borderColor: 'hsl(220, 12%, 20%)',
    },
    tr: {
      borderBottom: '1px solid hsl(220, 12%, 20%)',
      transition: 'background-color 300ms ease-out',
    },
    td: {
      padding: 'var(--spacing-md)',
      color: 'var(--text)',
    },
    emptyState: {
      padding: 'var(--spacing-2xl)',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.9375rem',
    },
    rightSidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-2xl)',
    },
    card: {
      backgroundColor: 'var(--surface-2)',
      border: '1px solid hsl(220, 12%, 20%)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-xl)',
      animation: 'fadeInUp 600ms ease-out 200ms forwards',
      opacity: 0,
    },
    '@media (max-width: 1024px)': {
      gridLayout: {
        gridTemplateColumns: '1fr',
      },
      statGrid: {
        gridTemplateColumns: 'repeat(2, 1fr)',
      },
    },
    '@media (max-width: 640px)': {
      container: {
        padding: 'var(--spacing-xl) var(--spacing-lg)',
      },
      gridLayout: {
        gridTemplateColumns: '1fr',
      },
      statGrid: {
        gridTemplateColumns: '1fr',
      },
      heroAmount: {
        fontSize: '2rem',
      },
    },
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.greeting}>Welcome, {user?.name?.split(' ')[0] || 'Trader'}</h1>
        <p style={styles.subtitle}>Here's a snapshot of your wallet and portfolio.</p>
      </header>

      <div style={styles.gridLayout}>
        {/* Left Column: Main Content */}
        <div style={styles.leftColumn}>
          {/* Hero Card */}
          <div style={styles.heroCard}>
            <div style={styles.heroGradient} />
            <div style={styles.heroContent}>
              <div style={styles.heroLabel}>Total Balance</div>
              <div style={styles.heroAmount}>
                {walletLoading ? '—' : (balance?.toFixed(2) ?? '0.00')}
              </div>
              <div style={styles.heroCurrency}>USDC</div>

              <div style={styles.statGrid}>
                <div style={{ ...styles.stat, animationDelay: '100ms' }}>
                  <div style={styles.statLabel}>Invested</div>
                  <div style={styles.statValue}>{totalInvested.toFixed(0)}</div>
                  <div style={styles.statUnit}>USDC</div>
                </div>
                <div style={{ ...styles.stat, animationDelay: '200ms' }}>
                  <div style={styles.statLabel}>Est. Earnings</div>
                  <div style={styles.statValue}>{totalEarned.toFixed(0)}</div>
                  <div style={styles.statUnit}>Annualized</div>
                </div>
                <div style={{ ...styles.stat, animationDelay: '300ms' }}>
                  <div style={styles.statLabel}>Active Loans</div>
                  <div style={styles.statValue}>{activeLoans}</div>
                  <div style={styles.statUnit}>Positions</div>
                </div>
              </div>

              <div style={styles.actionsBar}>
                <a href="/invest" style={{ ...styles.button('primary'), textDecoration: 'none' }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.opacity = '0.9'
                     e.currentTarget.style.transform = 'translateY(-2px)'
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.opacity = '1'
                     e.currentTarget.style.transform = 'translateY(0)'
                   }}>
                  Invest
                </a>
                <a href="/borrow" style={{ ...styles.button('secondary'), textDecoration: 'none' }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.borderColor = 'var(--accent)'
                     e.currentTarget.style.color = 'var(--accent)'
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.borderColor = 'hsl(220, 12%, 25%)'
                     e.currentTarget.style.color = 'var(--text)'
                   }}>
                  Borrow
                </a>
                <a href="/spend" style={{ ...styles.button('secondary'), textDecoration: 'none' }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.borderColor = 'var(--accent)'
                     e.currentTarget.style.color = 'var(--accent)'
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.borderColor = 'hsl(220, 12%, 25%)'
                     e.currentTarget.style.color = 'var(--text)'
                   }}>
                  Spend
                </a>
              </div>
            </div>
          </div>

          {/* Portfolio Chart */}
          <div style={styles.cardContainer}>
            <h2 style={styles.sectionTitle}>Portfolio Performance</h2>
            <PortfolioChart />
          </div>

          {/* Recent Activity */}
          <div style={styles.cardContainer}>
            <h2 style={styles.sectionTitle}>Recent Activity</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date</th>
                  </tr>
                </thead>
                <tbody style={styles.tbody}>
                  {transactions.length === 0 && !txLoading ? (
                    <tr>
                      <td colSpan={4} style={styles.emptyState}>
                        No transactions yet. Start by investing or borrowing.
                      </td>
                    </tr>
                  ) : (
                    transactions.slice(0, 6).map((tx) => (
                      <TransactionRow key={tx.id} transaction={tx} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={styles.rightSidebar}>
          <div style={styles.card}>
            <WalletCard balance={balance ?? 0} />
          </div>
          <div style={styles.card}>
            <LoanCard loan={loans[0] ?? { collateral: 0, borrowed: 0, repaid: 0, healthFactor: 0 }} />
          </div>
        </div>
      </div>
    </main>
  )
}
