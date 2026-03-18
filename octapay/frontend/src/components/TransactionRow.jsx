export default function TransactionRow({ transaction }) {
  return (
    <tr className="border-b border-slate-100">
      <td className="py-3 px-2 text-sm">{transaction.type}</td>
      <td className="py-3 px-2 text-sm">{transaction.amount}</td>
      <td className="py-3 px-2 text-sm">{transaction.status}</td>
      <td className="py-3 px-2 text-sm">{new Date(transaction.createdAt).toLocaleString()}</td>
    </tr>
  )
}
