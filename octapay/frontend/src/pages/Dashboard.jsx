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
    // Rough estimate: annualized earnings based on APY for 1 year.
    return investments.reduce((sum, inv) => {
      const apy = inv.apy ?? 0
      return sum + (inv.amount ?? 0) * (apy / 100)
    }, 0)
  }, [investments])

  const activeLoans = useMemo(() => {
    return loans.filter((loan) => loan.status === 'active').length
  }, [loans])

  const loading = walletLoading || investLoading || loansLoading || txLoading

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Welcome back, {user?.name ?? 'octa trader'}</h1>
            <p className="mt-1 text-slate-300">Here's a snapshot of your wallet and portfolio.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/invest"
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Invest
            </a>
            <a
              href="/borrow"
              className="inline-flex items-center justify-center rounded-lg bg-slate-100/10 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-100/20"
            >
              Borrow
            </a>
            <a
              href="/spend"
              className="inline-flex items-center justify-center rounded-lg bg-slate-100/10 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-100/20"
            >
              Spend
            </a>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-6 rounded-2xl bg-white/10">
                <h2 className="text-sm font-semibold tracking-wide text-slate-200">Total balance</h2>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-bold">
                    {walletLoading ? '—' : balance?.toFixed(2) ?? '0.00'}
                  </span>
                  <span className="text-sm text-slate-300">USDC</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">Balances are estimated (USD).</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl bg-white/10">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">Invested</div>
                  <div className="mt-2 text-2xl font-bold">{totalInvested.toFixed(2)}</div>
                  <div className="mt-1 text-xs text-slate-400">USDC total</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/10">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">Estimated earnings</div>
                  <div className="mt-2 text-2xl font-bold">{totalEarned.toFixed(2)}</div>
                  <div className="mt-1 text-xs text-slate-400">Annualized</div>
                </div>
                <div className="p-6 rounded-2xl bg-white/10">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-300">Active loans</div>
                  <div className="mt-2 text-2xl font-bold">{activeLoans}</div>
                  <div className="mt-1 text-xs text-slate-400">Open positions</div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="p-6 rounded-2xl bg-white/10">
                <h2 className="text-sm font-semibold text-slate-200">Portfolio performance</h2>
                <PortfolioChart />
              </div>

              <div className="p-6 rounded-2xl bg-white/10">
                <h2 className="text-sm font-semibold text-slate-200">Recent activity</h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-slate-300">
                      <tr>
                        <th className="py-2 px-2">Type</th>
                        <th className="py-2 px-2">Amount</th>
                        <th className="py-2 px-2">Status</th>
                        <th className="py-2 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 && !txLoading ? (
                        <tr>
                          <td colSpan={4} className="py-4 text-center text-slate-400">
                            No transactions yet.
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
          </div>

          <div className="space-y-6">
            <WalletCard balance={balance ?? 0} />
            <LoanCard loan={loans[0] ?? { collateral: 0, borrowed: 0, repaid: 0, healthFactor: 0 }} />
          </div>
        </section>
      </div>
    </main>
  )
}
