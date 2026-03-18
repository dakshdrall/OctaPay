export default function LoanCard({ loan }) {
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold">Loan</h3>
      <div className="mt-4 space-y-1 text-sm text-slate-600">
        <div>Collateral: {loan?.collateral ?? 0} USDC</div>
        <div>Borrowed: {loan?.borrowed ?? 0} USDC</div>
        <div>Repaid: {loan?.repaid ?? 0} USDC</div>
        <div>Health: {loan?.healthFactor ?? 0}%</div>
      </div>
    </div>
  )
}
