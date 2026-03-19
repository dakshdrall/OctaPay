export default function InvestCard({ product, onInvest }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{product.description}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            product.risk === 'Low'
              ? 'bg-emerald-100 text-emerald-700'
              : product.risk === 'Medium'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-rose-100 text-rose-700'
          }`}
        >
          {product.risk}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-500">APY</div>
          <div className="text-lg font-semibold">{product.apy}%</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Min deposit</div>
          <div className="text-lg font-semibold">{product.minDeposit} USDC</div>
        </div>
      </div>
      <button
        onClick={() => onInvest?.(product)}
        className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
      >
        Invest
      </button>
    </div>
  )
}
