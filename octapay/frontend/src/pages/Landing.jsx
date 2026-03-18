export default function Landing() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-4xl font-bold">OctaPay</h1>
        <p className="text-lg text-slate-600">
          A self-custodial DeFi super-app built on Stellar Testnet.
        </p>
        <div className="space-x-3">
          <a
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
            href="/login"
          >
            Get started
          </a>
          <a
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
            href="/dashboard"
          >
            Demo dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
