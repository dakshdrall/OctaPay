export default function InvestCard({ product, onInvest }) {
  const riskColor = product.risk === 'Low' ? '#4ade80' : '#facc15'
  const bg = 'var(--surface-2)', border = '1px solid hsl(220,12%,20%)'
  const cyan = 'var(--accent)', text = 'var(--text)', muted = 'var(--text-muted)'
  const mono = 'var(--font-mono)', ff = 'var(--font-display)'
  return (
    <div style={{ background: bg, border, borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: text, fontFamily: ff }}>{product.name}</h3>
        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', background: riskColor + '22', color: riskColor, border: '1px solid ' + riskColor + '44' }}>{product.risk}</span>
      </div>
      <p style={{ fontSize: '0.875rem', color: muted, lineHeight: 1.6 }}>{product.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: border }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>APY</div>
          <div style={{ fontSize: '1.5rem', fontFamily: mono, fontWeight: 600, color: cyan }}>{product.apy}%</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Min deposit</div>
          <div style={{ fontSize: '1.5rem', fontFamily: mono, fontWeight: 600, color: text }}>{product.minDeposit} USDC</div>
        </div>
      </div>
      <button onClick={() => onInvest(product)} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: cyan, color: 'var(--surface)', fontWeight: 700, fontSize: '0.95rem', fontFamily: ff, border: 'none', cursor: 'pointer', marginTop: 'auto' }}>
        Invest
      </button>
    </div>
  )
}
