import { useMemo, useState } from 'react'
import InvestCard from '../components/InvestCard'

const PRODUCTS = [
  {
    id: 'stablebonds',
    name: 'Stablebonds',
    apy: 8,
    risk: 'Low',
    minDeposit: 10,
    description: 'A low-volatility product delivering stable returns over time.',
  },
  {
    id: 'defindex',
    name: 'DeFindex',
    apy: 12,
    risk: 'Medium',
    minDeposit: 25,
    description: 'Moderate risk with diversified yield strategies.',
  },
  {
    id: 'arka',
    name: 'Arka.Fund',
    apy: 10,
    risk: 'Medium',
    minDeposit: 20,
    description: 'A curated portfolio of high-quality on-chain assets.',
  },
]

export default function Invest() {
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const selectedProduct = useMemo(
    () => PRODUCTS.find((product) => product.id === selected),
    [selected]
  )

  const openModal = (product) => {
    setSelected(product.id)
    setAmount('')
    setConfirmation(null)
  }

  const closeModal = () => {
    setSelected(null)
    setAmount('')
    setConfirmation(null)
  }

  const handleInvest = () => {
    if (!selectedProduct) return
    if (!amount || Number(amount) < selectedProduct.minDeposit) {
      setConfirmation(`Minimum deposit is ${selectedProduct.minDeposit} USDC.`)
      return
    }

    setConfirmation(`Invested ${amount} USDC into ${selectedProduct.name}. (Mock)`) // TODO: wire API
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Invest</h1>
            <p className="mt-1 text-slate-300">
              Choose a yield product and allocate your USDC.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-lg bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/20"
            >
              Dashboard
            </a>
            <a
              href="/borrow"
              className="inline-flex items-center justify-center rounded-lg bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/20"
            >
              Borrow
            </a>
          </div>
        </header>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PRODUCTS.map((product) => (
            <InvestCard key={product.id} product={product} onInvest={openModal} />
          ))}
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-slate-900 shadow-xl">
              <header className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Invest in {selectedProduct.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">Minimum deposit: {selectedProduct.minDeposit} USDC</p>
                </div>
                <button
                  onClick={closeModal}
                  className="rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200"
                >
                  ×
                </button>
              </header>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Amount (USDC)</span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    min={selectedProduct.minDeposit}
                    placeholder={`${selectedProduct.minDeposit}`}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  />
                </label>

                {confirmation && (
                  <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                    {confirmation}
                  </div>
                )}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleInvest}
                    className="flex-1 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Confirm investment
                  </button>
                  <button
                    onClick={closeModal}
                    className="flex-1 rounded-lg bg-gray-700 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-600"
                  >
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
