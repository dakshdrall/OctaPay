export default function WalletCard({ balance, currency = 'USDC' }) {
  return (
    <div style={{ fontFamily: 'var(--font-display)' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Stellar Wallet</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem', padding: '0.5rem', background: 'rgba(0,255,255,0.04)', borderRadius: '6px', border: '1px solid rgba(0,255,255,0.08)' }}>GBFNQL...CVBIF</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Available Balance</div>
      <div style={{ fontSize: '2rem', fontFamily: 'var(--font-mono)', fontWeight: 500, color: 'var(--accent)', letterSpacing: '-0.02em' }}>
        {balance?.toFixed(2) ?? '0.00'}
        <span style={{ fontSize: '1rem', marginLeft: '0.5rem', color: 'var(--text-muted)', fontWeight: 400 }}>{currency}</span>
      </div>
      <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
        {['Testnet', 'Soroban'].map(tag => (
          <span key={tag} style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(0,255,255,0.2)', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{tag}</span>
        ))}
      </div>
    </div>
  )
}
