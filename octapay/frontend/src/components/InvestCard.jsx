export default function InvestCard({ product }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{product.description}</p>
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
      <button className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500">
        Allocate
      </button>
    </div>
  )
}
