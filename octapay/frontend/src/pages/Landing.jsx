import { Link } from 'react-router-dom'

const FEATURES = [
  {
    title: 'Auto Growth',
    description: 'Invest in high-yield products and watch a data-driven balance chart grow.',
  },
  {
    title: 'Collateralized Borrowing',
    description: 'Lock assets to borrow USDC at competitive rates with Soroban security.',
  },
  {
    title: 'Seamless Spending',
    description: 'Virtual card mock mode for expense tracking and instant spend insights.',
  },
  {
    title: 'Safe Self-Custody',
    description: 'Your keys never leave the backend vault, while you control the funds.',
  },
]

export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <article>
            <p className="inline-flex items-center rounded-full bg-indigo-600/30 px-3 py-1 text-xs uppercase tracking-wider text-indigo-200">
              Built on Stellar testnet & Soroban
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Your Money. Growing. Always.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-300">
              OctaPay gives you a clean DeFi experience with wallet management, earnings analytics,
              collateral lending, and simplified spending in a single workspace.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-400"
              >
                Get started
              </Link>
              <Link
                to="/dashboard"
                className="rounded-lg border border-indigo-300/40 px-6 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
              >
                View dashboard
              </Link>
            </div>
          </article>

          <section className="grid gap-4">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-white/10 bg-slate-900/50 p-5 shadow-lg shadow-black/20">
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-slate-300">{feature.description}</p>
              </div>
            ))}
          </section>
        </div>
      </div>
    </main>
  )
}
