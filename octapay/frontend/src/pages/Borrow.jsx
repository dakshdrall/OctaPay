import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import useWallet from '../hooks/useWallet'
import useLoans from '../hooks/useLoans'
import LoanCard from '../components/LoanCard'

export default function Borrow() {
  const { authFetch } = useAuth()
  const { balance, loading: walletLoading, refresh: refreshWallet } = useWallet()
  const { loans, loading: loansLoading, refresh: refreshLoans } = useLoans()

  const [collateral, setCollateral] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [repayLoanId, setRepayLoanId] = useState(null)
  const [repayAmount, setRepayAmount] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)

  const availableBalance = balance ?? 0
  const collateralNumber = Number(collateral)
  const maxBorrow = useMemo(() => {
    if (!collateralNumber || collateralNumber <= 0) return 0
    return Math.floor(collateralNumber * 0.6 * 100) / 100
  }, [collateralNumber])

  const handleBorrow = async () => {
    setError(null)
    setSuccessMessage(null)

    if (!collateralNumber || collateralNumber <= 0) {
      setError('Enter a valid collateral amount')
      return
    }

    if (collateralNumber > availableBalance) {
      setError('Collateral cannot exceed available balance')
      return
    }

    setLoading(true)
    try {
      const res = await authFetch('/api/borrow', {
        method: 'POST',
        body: JSON.stringify({ collateral: collateralNumber }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Unable to create loan')
        return
      }

      setSuccessMessage('Loan created successfully!')
      setCollateral('')
      refreshWallet()
      refreshLoans()
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const openRepay = (loan) => {
    setRepayLoanId(loan.id)
    const outstanding = Math.max(loan.borrowed - loan.repaid, 0)
    setRepayAmount(outstanding.toString())
    setError(null)
    setSuccessMessage(null)
  }

  const closeRepay = () => {
    setRepayLoanId(null)
    setRepayAmount('')
  }

  const handleRepay = async () => {
    const amountNumber = Number(repayAmount)
    if (!amountNumber || amountNumber <= 0) {
      setError('Enter a valid repay amount')
      return
    }

    if (amountNumber > availableBalance) {
      setError('Insufficient balance to repay')
      return
    }

    setLoading(true)
    try {
      const res = await authFetch('/api/borrow/repay', {
        method: 'POST',
        body: JSON.stringify({ loanId: repayLoanId, amount: amountNumber }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Unable to repay loan')
        return
      }

      setSuccessMessage('Repayment successful')
      closeRepay()
      refreshWallet()
      refreshLoans()
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const activeLoans = loans.filter((loan) => loan.status === 'active')

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Borrow</h1>
            <p className="mt-1 text-slate-300">Lock USDC as collateral and borrow up to 60%.</p>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-white/10 p-6">
              <h2 className="text-lg font-semibold">Collateral</h2>
              <p className="mt-1 text-sm text-slate-300">
                Available balance: <span className="font-medium">{walletLoading ? '—' : availableBalance.toFixed(2)} USDC</span>
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-slate-200">Collateral amount</span>
                  <input
                    value={collateral}
                    onChange={(e) => setCollateral(e.target.value)}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </label>
                <div>
                  <div className="text-sm font-medium text-slate-200">Max borrowable</div>
                  <div className="mt-2 text-3xl font-semibold">{maxBorrow.toFixed(2)} USDC</div>
                </div>
              </div>

              {error && <div className="mt-4 rounded-md bg-rose-500/15 px-4 py-3 text-sm text-rose-100">{error}</div>}
              {successMessage && <div className="mt-4 rounded-md bg-emerald-500/15 px-4 py-3 text-sm text-emerald-100">{successMessage}</div>}

              <button
                onClick={handleBorrow}
                disabled={loading}
                className="mt-4 w-full rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {loading ? 'Processing…' : 'Borrow USDC'}
              </button>
            </div>

            <div className="rounded-2xl bg-white/10 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Active loans</h2>
                <span className="text-sm text-slate-300">{activeLoans.length} open</span>
              </div>

              {activeLoans.length === 0 ? (
                <p className="mt-4 text-sm text-slate-300">No active loans yet. Borrow to get started.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {activeLoans.map((loan) => {
                    const outstanding = Math.max(loan.borrowed - loan.repaid, 0)
                    return (
                      <div
                        key={loan.id}
                        className="rounded-xl bg-slate-900/40 p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-slate-200">Loan ID {loan.id.slice(0, 8)}</p>
                            <p className="mt-1 text-sm text-slate-300">
                              Due {new Date(loan.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-300">Collateral</p>
                            <p className="text-lg font-semibold">{loan.collateral.toFixed(2)} USDC</p>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-lg bg-slate-950/60 p-3">
                            <p className="text-xs text-slate-400">Borrowed</p>
                            <p className="text-lg font-semibold">{loan.borrowed.toFixed(2)} USDC</p>
                          </div>
                          <div className="rounded-lg bg-slate-950/60 p-3">
                            <p className="text-xs text-slate-400">Repaid</p>
                            <p className="text-lg font-semibold">{loan.repaid.toFixed(2)} USDC</p>
                          </div>
                          <div className="rounded-lg bg-slate-950/60 p-3">
                            <p className="text-xs text-slate-400">Outstanding</p>
                            <p className="text-lg font-semibold">{outstanding.toFixed(2)} USDC</p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => openRepay(loan)}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                          >
                            Repay
                          </button>
                          <span className="text-xs text-slate-400">
                            Health: {Math.round((loan.repaid / Math.max(loan.borrowed, 1)) * 100)}%
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <LoanCard
              loan={activeLoans[0] ?? { collateral: 0, borrowed: 0, repaid: 0, healthFactor: 0 }}
            />
          </div>
        </section>

        {repayLoanId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
              <h2 className="text-xl font-semibold">Repay loan</h2>
              <p className="mt-1 text-sm text-slate-600">
                Enter the amount you want to repay. Remaining balance will stay as outstanding loan.
              </p>

              <label className="mt-5 block">
                <span className="text-sm font-medium text-slate-700">Amount (USDC)</span>
                <input
                  value={repayAmount}
                  onChange={(e) => setRepayAmount(e.target.value)}
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </label>

              {error && <div className="mt-4 rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleRepay}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {loading ? 'Repaying…' : 'Confirm repayment'}
                </button>
                <button
                  onClick={closeRepay}
                  className="flex-1 rounded-lg bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
