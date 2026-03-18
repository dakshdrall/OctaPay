export default function WalletCard({ balance, currency = 'USDC' }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold">Wallet</h2>
      <p className="mt-2 text-sm text-slate-600">Available balance</p>
      <div className="mt-4 text-3xl font-bold">
        {balance?.toFixed(2) ?? '0.00'} {currency}
      </div>
    </div>
  )
}
