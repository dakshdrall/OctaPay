export default function LoanCard({ loan }) {
  const health = loan?.healthFactor ?? 0
  const healthColor = health > 150 ? '#4ade80' : health > 100 ? '#facc15' : '#f87171'
  return (
    <div style={{ fontFamily: 'var(--font-display)' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Loan Position</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[['Collateral', loan?.collateral ?? 0], ['Borrowed', loan?.borrowed ?? 0], ['Repaid', loan?.repaid ?? 0]].map(([label, val]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid hsl(220,12%,18%)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{val} USDC</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Health Factor</span>
          <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-mono)', color: healthColor, fontWeight: 600 }}>{health}%</span>
        </div>
        <div style={{ height: '4px', background: 'var(--surface)', borderRadius: '999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: Math.min(health,200)/2+'%', background: healthColor, borderRadius: '999px' }} />
        </div>
      </div>
    </div>
  )
}
