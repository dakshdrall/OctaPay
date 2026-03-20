import { useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import useWallet from '../hooks/useWallet'
import useInvestments from '../hooks/useInvestments'
import useLoans from '../hooks/useLoans'

export default function Profile() {
  const { user, authFetch, logout } = useAuth()
  const { publicKey, loading: walletLoading } = useWallet()
  const { investments } = useInvestments()
  const { loans } = useLoans()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)

  const totalInvested = useMemo(() => investments.reduce((sum, inv) => sum + (inv.amount ?? 0), 0), [investments])
  const totalEarned = useMemo(() => {
    return investments.reduce((sum, inv) => {
      const apy = inv.apy ?? 0
      return sum + (inv.amount ?? 0) * (apy / 100)
    }, 0)
  }, [investments])

  const loansTaken = loans.length

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!currentPassword || !newPassword) {
      setError('Please enter current and new password')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setUpdating(true)
    try {
      const res = await authFetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Unable to update password')

      setMessage('Password updated successfully. Please login again.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      logout()
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setUpdating(false)
    }
  }

  const copyAddress = async () => {
    if (!publicKey) return
    await navigator.clipboard.writeText(publicKey)
    setMessage('Wallet address copied to clipboard!')
    setTimeout(() => setMessage(null), 2200)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="rounded-2xl bg-white/10 p-6 text-slate-50">
          <h1 className="text-3xl font-semibold">Profile</h1>
          <p className="mt-1 text-slate-300">Manage your identity, wallet, and security settings.</p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-slate-900/70 p-5">
              <h2 className="text-lg font-semibold text-slate-100">Account</h2>
              <dl className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex justify-between">
                  <dt>Name</dt>
                  <dd className="font-medium">{user?.name ?? 'Available after login'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Email</dt>
                  <dd className="font-medium">{user?.email ?? '-'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Country</dt>
                  <dd className="font-medium">{user?.country || 'N/A'}</dd>
                </div>
                <div className="flex justify-between items-center">
                  <dt>Stellar Wallet</dt>
                  <dd className="font-mono text-xs">{walletLoading ? 'Loading...' : (publicKey || 'Not available')}</dd>
                </div>
              </dl>

              <button
                onClick={copyAddress}
                disabled={!publicKey}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                Copy public address
              </button>
            </div>

            <div className="rounded-xl bg-slate-900/70 p-5">
              <h2 className="text-lg font-semibold text-slate-100">Stats</h2>
              <div className="mt-4 grid gap-3">
                <div className="rounded-lg bg-slate-800 px-4 py-3">
                  <p className="text-xs uppercase text-slate-400">Total invested</p>
                  <p className="text-2xl font-semibold text-white">{totalInvested.toFixed(2)} USDC</p>
                </div>
                <div className="rounded-lg bg-slate-800 px-4 py-3">
                  <p className="text-xs uppercase text-slate-400">Total earned</p>
                  <p className="text-2xl font-semibold text-white">{totalEarned.toFixed(2)} USDC</p>
                </div>
                <div className="rounded-lg bg-slate-800 px-4 py-3">
                  <p className="text-xs uppercase text-slate-400">Loans taken</p>
                  <p className="text-2xl font-semibold text-white">{loansTaken}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold text-slate-100">Change password</h2>
            <form className="mt-4 space-y-4" onSubmit={handlePasswordChange}>
              <label className="block text-sm text-slate-300">
                <span>Current password</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500"
                />
              </label>
              <label className="block text-sm text-slate-300">
                <span>New password</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500"
                />
              </label>
              <label className="block text-sm text-slate-300">
                <span>Confirm new password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-indigo-500"
                />
              </label>

              {error && <p className="rounded-md bg-rose-500/20 p-2 text-sm text-rose-100">{error}</p>}
              {message && <p className="rounded-md bg-emerald-500/20 p-2 text-sm text-emerald-100">{message}</p>}

              <button
                type="submit"
                disabled={updating}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {updating ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </div>

          <div className="mt-6">
            <button
              onClick={logout}
              className="rounded-lg border border-red-500 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
