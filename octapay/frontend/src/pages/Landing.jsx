import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '↑', title: 'Auto Growth', description: 'Invest in high-yield products and watch a data-driven balance chart grow.' },
  { icon: '◈', title: 'Collateralized Borrowing', description: 'Lock assets to borrow USDC at competitive rates with Soroban security.' },
  { icon: '→', title: 'Seamless Spending', description: 'Virtual card mock mode for expense tracking and instant spend insights.' },
  { icon: '◆', title: 'Safe Self-Custody', description: 'Your keys never leave the backend vault, while you control the funds.' },
]
const STATS = [{ value: '5', label: 'Test Wallets' }, { value: '100%', label: 'On-Chain' }, { value: '0%', label: 'Custody Risk' }, { value: 'XLM', label: 'Powered By' }]
const STEPS = [
  { n: '01', title: 'Create Account', desc: 'Register with email — a Stellar testnet wallet is automatically generated for you.' },
  { n: '02', title: 'Fund & Invest', desc: 'Receive testnet USDC and deploy it into high-yield investment products.' },
  { n: '03', title: 'Borrow & Spend', desc: 'Lock collateral to borrow USDC, or use the virtual card for tracked spending.' },
]

export default function Landing() {
  const bg = 'var(--color-bg)', surface = 'var(--color-surface)', surface2 = 'var(--color-surface-2)'
  const cyan = 'var(--color-cyan)', text = 'var(--color-text)', muted = 'var(--color-text-muted)'
  const ff = 'var(--font-display)', mono = 'var(--font-mono)'
  return (
    <main style={{ minHeight: '100vh', background: bg, color: text, fontFamily: ff }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2.5rem', borderBottom: `1px solid ${surface2}` }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: cyan }}>◆ OctaPay</div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/login" style={{ fontSize: '0.875rem', color: muted, textDecoration: 'none' }}>Sign in</Link>
          <Link to="/login" style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: cyan, color: bg, fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none' }}>Get started</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2.5rem 4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <article>
          <p style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '999px', border: `1px solid ${cyan}`, padding: '0.25rem 0.875rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: cyan, marginBottom: '1.5rem' }}>◆ Built on Stellar testnet & Soroban</p>
          <h1 style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.25rem' }}>Your Money.<br />Growing. Always.</h1>
          <p style={{ fontSize: '1.05rem', color: muted, lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: '460px' }}>OctaPay gives you a clean DeFi experience with wallet management, earnings analytics, collateral lending, and simplified spending in a single workspace.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/login" style={{ padding: '0.875rem 2rem', borderRadius: '10px', background: cyan, color: bg, fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>Get started</Link>
            <Link to="/dashboard" style={{ padding: '0.875rem 2rem', borderRadius: '10px', border: `1px solid ${surface2}`, color: text, background: surface, fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>View dashboard</Link>
          </div>
        </article>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: surface, border: `1px solid ${surface2}`, borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.1rem', color: cyan, marginTop: '2px' }}>{f.icon}</span>
              <div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.95rem' }}>{f.title}</div>
                <div style={{ fontSize: '0.825rem', color: muted, lineHeight: 1.5 }}>{f.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: surface, borderTop: `1px solid ${surface2}`, borderBottom: `1px solid ${surface2}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: cyan, fontFamily: mono }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2.5rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: cyan, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>How it works</div>
        <div style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 800, marginBottom: '3rem' }}>Three steps to DeFi</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2rem' }}>
          {STEPS.map(s => (
            <div key={s.n} style={{ padding: '2rem', background: surface, border: `1px solid ${surface2}`, borderRadius: '16px' }}>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: 'rgba(0,255,255,0.1)', fontFamily: mono, lineHeight: 1, marginBottom: '1rem' }}>{s.n}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', color: cyan }}>{s.title}</div>
              <div style={{ fontSize: '0.875rem', color: muted, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: surface, borderTop: `1px solid ${surface2}`, textAlign: 'center', padding: '5rem 2.5rem' }}>
        <div style={{ fontSize: 'clamp(1.75rem,3vw,2.5rem)', fontWeight: 800, marginBottom: '1rem' }}>Ready to start?</div>
        <div style={{ fontSize: '1rem', color: muted, marginBottom: '2.5rem' }}>Join OctaPay and explore DeFi on Stellar testnet — no real funds needed.</div>
        <Link to="/login" style={{ padding: '0.875rem 2rem', borderRadius: '10px', background: cyan, color: bg, fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>Create free account</Link>
      </div>

      <div style={{ borderTop: `1px solid ${surface2}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: cyan }}>◆ OctaPay</div>
          <div style={{ fontSize: '0.8rem', color: muted }}>Built on Stellar testnet & Soroban · {new Date().getFullYear()}</div>
        </div>
      </div>
    </main>
  )
}
