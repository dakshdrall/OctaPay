export default function Login() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-semibold">Sign in to OctaPay</h1>
        <p className="text-sm text-slate-600">
          Authenticate with Google or email to create your Stellar testnet wallet.
        </p>
        <div className="grid gap-3">
          <button className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
            Continue with Google
          </button>
          <button className="w-full py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">
            Continue with email
          </button>
        </div>
      </div>
    </main>
  )
}
