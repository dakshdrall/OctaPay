import { Link } from 'react-router-dom'

const FEATURES = [
  { title: 'Auto Growth', description: 'Invest in high-yield products and watch a data-driven balance chart grow.' },
  { title: 'Collateralized Borrowing', description: 'Lock assets to borrow USDC at competitive rates with Soroban security.' },
  { title: 'Seamless Spending', description: 'Virtual card mock mode for expense tracking and instant spend insights.' },
  { title: 'Safe Self-Custody', description: 'Your keys never leave the backend vault, while you control the funds.' },
]

export default function Landing() {
  return (
    <main style={{ minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'var(--font-display)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 1.5rem' }}>
        <div style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center' }}>

          <article>
            <p style={{
              display: 'inline-flex', alignItems: 'center',
              borderRadius: '999px', border: '1px solid var(--color-cyan)',
              padding: '0.25rem 0.875rem', fontSize: '0.7rem',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              color: 'var(--color-cyan)', marginBottom: '1.5rem'
            }}>
              Built on Stellar testnet & Soroban
            </p>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.25rem' }}>
              Your Money.<br />Growing. Always.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', maxWidth: '480px', lineHeight: 1.7, marginBottom: '2rem' }}>
              OctaPay gives you a clean DeFi experience with wallet management, earnings analytics,
              collateral lending, and simplified spending in a single workspace.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/login" style={{
                padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 700,
                fontSize: '0.9rem', textDecoration: 'none',
                background: 'var(--color-cyan)', color: 'var(--color-bg)',
                transition: 'opacity 0.2s'
              }}>
                Get started
              </Link>
              <Link to="/dashboard" style={{
                padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 600,
                fontSize: '0.9rem', textDecoration: 'none',
                border: '1px solid var(--color-surface-2)',
                color: 'var(--color-text)', background: 'var(--color-surface)',
                transition: 'border-color 0.2s'
              }}>
                View dashboard
              </Link>
            </div>
          </article>

          <section style={{ display: 'grid', gap: '1rem' }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                borderRadius: '16px',
                border: '1px solid var(--color-surface-2)',
                background: 'var(--color-surface)',
                padding: '1.25rem 1.5rem',
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-cyan)', marginBottom: '0.4rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{f.description}</p>
              </div>
            ))}
          </section>

        </div>
      </div>
    </main>
  )
}
