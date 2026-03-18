export default function Dashboard() {
  return (
    <main className="min-h-screen p-6 bg-slate-50">
      <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <section className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-medium">Wallet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Your testnet USDC balance and recent activity will appear here.
          </p>
        </section>
        <section className="p-6 bg-white rounded-xl shadow-sm">
          <h2 className="text-xl font-medium">Portfolio</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track investments, loans, and spendable balance.
          </p>
        </section>
      </div>
    </main>
  )
}
