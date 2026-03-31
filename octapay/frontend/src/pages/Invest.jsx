import { useState } from 'react'

const PRODUCTS = [
  { id: 'stablebonds', name: 'Stablebonds', apy: 8, risk: 'Low', riskColor: '#4ade80', minDeposit: 10, description: 'A low-volatility product delivering stable returns over time.' },
  { id: 'defindex', name: 'DeFindex', apy: 12, risk: 'Medium', riskColor: '#facc15', minDeposit: 25, description: 'Moderate risk with diversified yield strategies.' },
  { id: 'arka', name: 'Arka.Fund', apy: 10, risk: 'Medium', riskColor: '#facc15', minDeposit: 20, description: 'A curated portfolio of high-quality on-chain assets.' },
]

export default function Invest() {
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [confirmation, setConfirmation] = useState(null)
  const product = PRODUCTS.find(p => p.id === selected)
  const bg = 'var(--surface)', s2 = 'var(--surface-2)', cyan = 'var(--accent)'
  const border = '1px solid hsl(220,12%,20%)', radius = '16px'
  const mono = 'var(--font-mono)', ff = 'var(--font-display)'
  const text = 'var(--text)', muted = 'var(--text-muted)'

  return (
    <main style={{ minHeight: '100vh', background: bg, padding: 'clamp(1.25rem,4vw,2.5rem) clamp(1rem,3vw,1.5rem)', fontFamily: ff }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 800, color: text, marginBottom: '0.35rem' }}>Invest</h1>
            <p style={{ color: muted, fontFamily: mono, fontSize: '0.9rem' }}>Choose a yield product and allocate your USDC.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[['Dashboard','/dashboard'],['Borrow','/borrow']].map(([label,href]) => (
              <a key={label} href={href} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: s2, border, color: text, textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>{label}</a>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem' }}>
          {PRODUCTS.map(p => (
            <div key={p.id} style={{ background: s2, border, borderRadius: radius, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: text }}>{p.name}</h3>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', background: p.riskColor + '22', color: p.riskColor, border: '1px solid ' + p.riskColor + '44' }}>{p.risk}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: muted, lineHeight: 1.6 }}>{p.description}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: border }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>APY</div>
                  <div style={{ fontSize: '1.5rem', fontFamily: mono, fontWeight: 600, color: cyan }}>{p.apy}%</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.65rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Min deposit</div>
                  <div style={{ fontSize: '1.5rem', fontFamily: mono, fontWeight: 600, color: text }}>{p.minDeposit} USDC</div>
                </div>
              </div>
              <button onClick={() => { setSelected(p.id); setAmount(''); setConfirmation(null) }}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: cyan, color: bg, fontWeight: 700, fontSize: '0.95rem', fontFamily: ff, border: 'none', cursor: 'pointer', marginTop: 'auto' }}>
                Invest
              </button>
            </div>
          ))}
        </div>

        {product && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '480px', background: s2, border, borderRadius: radius, padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: text, marginBottom: '0.25rem' }}>Invest in {product.name}</h2>
                  <p style={{ fontSize: '0.8rem', color: muted, fontFamily: mono }}>Minimum: {product.minDeposit} USDC · APY: {product.apy}%</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'hsl(220,12%,25%)', border: 'none', color: text, borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700 }}>×</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>Amount (USDC)</label>
                  <input value={amount} onChange={e => setAmount(e.target.value)} type="number" min={product.minDeposit} placeholder={String(product.minDeposit)}
                    style={{ width: '100%', background: bg, border, borderRadius: '8px', padding: '0.75rem 1rem', color: text, fontFamily: mono, fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                {confirmation && (
                  <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: confirmation.includes('Invested') ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', border: confirmation.includes('Invested') ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(248,113,113,0.3)', color: confirmation.includes('Invested') ? '#4ade80' : '#f87171', fontSize: '0.875rem', fontFamily: mono }}>
                    {confirmation}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={() => { if (!amount || Number(amount) < product.minDeposit) { setConfirmation('Minimum deposit is ' + product.minDeposit + ' USDC.'); return } setConfirmation('Invested ' + amount + ' USDC into ' + product.name + '. (Mock)') }}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: cyan, color: bg, fontWeight: 700, fontSize: '0.9rem', fontFamily: ff, border: 'none', cursor: 'pointer', minWidth: '120px' }}>
                    Confirm
                  </button>
                  <button onClick={() => setSelected(null)}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: 'hsl(220,12%,22%)', color: text, fontWeight: 600, fontSize: '0.9rem', fontFamily: ff, border, cursor: 'pointer', minWidth: '120px' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
