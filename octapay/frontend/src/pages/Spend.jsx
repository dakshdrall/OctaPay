import { useMemo, useState } from 'react'
import useWallet from '../hooks/useWallet'
import useTransactions from '../hooks/useTransactions'

function formatCardNumber(number) {
  return number.match(/.{1,4}/g)?.join(' ') ?? number
}

function generateCard() {
  const randDigits = () => Math.floor(1000 + Math.random() * 9000)
  const card = `${randDigits()}${randDigits()}${randDigits()}${randDigits()}`
  const expiryMonth = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')
  const expiryYear = String(new Date().getFullYear() + 2).slice(2)
  const cvv = String(Math.floor(100 + Math.random() * 900))
  return { card, expiry: `${expiryMonth}/${expiryYear}`, cvv }
}

export default function Spend() {
  const { balance, loading: walletLoading } = useWallet()
  const { transactions, loading: txLoading } = useTransactions()
  const [cardInfo, setCardInfo] = useState(generateCard())
  const [active, setActive] = useState(false)

  const spendable = balance ?? 0

  const cardTransactions = useMemo(
    () => transactions.filter((tx) => tx.type === 'spend' || tx.type === 'card'),
    [transactions]
  )

  const handleActivate = () => {
    setActive(true)
    setCardInfo(generateCard())
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Spend</h1>
            <p className="mt-1 text-slate-300">Use your virtual card for in-app spending (mock).</p>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl bg-gradient-to-br from-[hsl(180,30%,10%)] via-[hsl(220,15%,10%)] to-[hsl(220,15%,12%)] p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-300">Spendable balance</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {walletLoading ? '—' : spendable.toFixed(2)} USDC
                  </p>
                </div>
                <button
                  onClick={handleActivate}
                  disabled={active}
                  className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
                >
                  {active ? 'Active' : 'Activate Card'}
                </button>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-950/80 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">Virtual Card</p>
                    <p className="mt-2 text-xl font-semibold text-white">OctaPay Visa</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Expiry</p>
                    <p className="text-lg font-semibold">{cardInfo.expiry}</p>
                  </div>
                </div>

                <div className="mt-6 text-2xl tracking-widest text-white">
                  {formatCardNumber(cardInfo.card)}
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                  <div>
                    <p className="uppercase tracking-widest">Cardholder</p>
                    <p className="mt-1">OctaPay User</p>
                  </div>
                  <div>
                    <p className="uppercase tracking-widest">CVV</p>
                    <p className="mt-1">{active ? cardInfo.cvv : '•••'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-6">
              <h2 className="text-lg font-semibold">Recent card transactions</h2>
              <p className="mt-1 text-sm text-slate-300">Mock spend activity for your virtual card.</p>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-white/10 text-slate-300">
                    <tr>
                      <th className="py-2 px-2">Date</th>
                      <th className="py-2 px-2">Description</th>
                      <th className="py-2 px-2">Amount</th>
                      <th className="py-2 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txLoading ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-400">
                          Loading…
                        </td>
                      </tr>
                    ) : cardTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-400">
                          No card transactions yet.
                        </td>
                      </tr>
                    ) : (
                      cardTransactions.slice(0, 6).map((tx) => (
                        <tr key={tx.id} className="border-b border-white/10">
                          <td className="py-3 px-2">{new Date(tx.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-2 text-slate-200">{tx.type}</td>
                          <td className="py-3 px-2">{tx.amount.toFixed(2)}</td>
                          <td className="py-3 px-2 text-slate-200">{tx.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white/10 p-6">
              <h2 className="text-lg font-semibold">Card Overview</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li className="flex items-center justify-between">
                  <span>Status</span>
                  <span className={`font-semibold ${active ? 'text-emerald-200' : 'text-slate-400'}`}>
                    {active ? 'Active' : 'Inactive'}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Spend limit</span>
                  <span className="font-semibold">{spendable.toFixed(2)} USDC</span>
                </li>
                <li className="flex items-center justify-between">
                  <span>Card network</span>
                  <span className="font-semibold">Visa</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
