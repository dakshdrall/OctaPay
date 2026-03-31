import { useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import useWallet from '../hooks/useWallet'
import useInvestments from '../hooks/useInvestments'
import useLoans from '../hooks/useLoans'
import useTransactions from '../hooks/useTransactions'
import WalletCard from '../components/WalletCard'
import LoanCard from '../components/LoanCard'
import PortfolioChart from '../components/PortfolioChart'
import TransactionRow from '../components/TransactionRow'

const s = {
  surface: 'var(--surface-2)', border: '1px solid hsl(220,12%,20%)',
  radius: '16px', pad: '1.5rem', mono: 'var(--font-mono)',
  cyan: 'var(--accent)', muted: 'var(--text-muted)', text: 'var(--text)',
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background: s.surface, border: s.border, borderRadius: s.radius, padding: s.pad, ...style }}>
      {children}
    </div>
  )
}

function StatBox({ label, value, unit }) {
  return (
    <div>
      <div style={{ fontSize: '0.65rem', fontWeight: 600, color: s.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontFamily: s.mono, color: s.text, fontWeight: 500 }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: s.muted, fontFamily: s.mono, marginTop: '0.2rem' }}>{unit}</div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { balance, loading: walletLoading } = useWallet()
  const { investments } = useInvestments()
  const { loans } = useLoans()
  const { transactions, loading: txLoading } = useTransactions()

  const totalInvested = useMemo(() => investments.reduce((s, i) => s + (i.amount ?? 0), 0), [investments])
  const totalEarned = useMemo(() => investments.reduce((s, i) => s + (i.amount ?? 0) * ((i.apy ?? 0) / 100), 0), [investments])
  const activeLoans = useMemo(() => loans.filter(l => l.status === 'active').length, [loans])

  return (
    <main style={{ minHeight: '100vh', background: 'var(--surface)', padding: '2.5rem 2rem', fontFamily: 'var(--font-display)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: s.text, letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
          Welcome, {user?.name?.split(' ')[0] || 'Trader'}
        </h1>
        <p style={{ color: s.muted, fontFamily: s.mono, fontSize: '0.9rem' }}>Here's a snapshot of your wallet and portfolio.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className='dash-grid-main'>
        <Card style={{ background: 'hsl(180,30%,12%)', border: '1px solid hsl(180,30%,18%)' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 600, color: s.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Total Balance</div>
          <div style={{ fontSize: '3.5rem', fontFamily: s.mono, fontWeight: 500, color: s.cyan, letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '0.35rem' }}>
            {walletLoading ? '—' : (balance?.toFixed(2) ?? '0.00')}
          </div>
          <div style={{ fontSize: '1rem', color: s.muted, fontFamily: s.mono, marginBottom: '2rem' }}>USDC</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid hsl(180,20%,18%)' }} className='dash-grid-stats'>
            <StatBox label="Invested" value={totalInvested.toFixed(0)} unit="USDC" />
            <StatBox label="Est. Earnings" value={totalEarned.toFixed(0)} unit="Annualized" />
            <StatBox label="Active Loans" value={activeLoans} unit="Positions" />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid hsl(180,20%,18%)' }}>
            {[['Invest','/invest','primary'],['Borrow','/borrow','secondary'],['Spend','/spend','secondary']].map(([label,href,variant]) => (
              <a key={label} href={href} style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--font-display)', transition: 'opacity 0.2s',
                background: variant === 'primary' ? s.cyan : 'transparent',
                color: variant === 'primary' ? 'var(--surface)' : s.text,
                border: variant === 'primary' ? 'none' : '1px solid hsl(220,12%,25%)',
              }}>{label}</a>
            ))}
          </div>
        </Card>
        <Card>
          <WalletCard balance={balance ?? 0} />
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }} className='dash-grid-main'>
        <Card>
          <PortfolioChart />
        </Card>
        <Card>
          <LoanCard loan={loans[0] ?? { collateral: 0, borrowed: 0, repaid: 0, healthFactor: 0 }} />
        </Card>
      </div>

      <Card>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: s.text, marginBottom: '1rem' }}>Recent Activity</h2>
        {txLoading ? (
          <p style={{ color: s.muted, fontFamily: s.mono, fontSize: '0.875rem' }}>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p style={{ color: s.muted, fontSize: '0.9rem', padding: '1.5rem 0', textAlign: 'center' }}>No transactions yet. Start by investing or borrowing.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(220,12%,20%)' }}>
                {['Type','Amount','Status','Date'].map(h => (
                  <th key={h} style={{ padding: '0.6rem 0.75rem', textAlign: 'left', fontFamily: 'var(--font-display)', fontWeight: 600, color: s.muted, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0,6).map(tx => <TransactionRow key={tx.id} transaction={tx} />)}
            </tbody>
          </table>
        )}
      </Card>
    </main>
  )
}
