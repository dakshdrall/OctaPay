import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API_BASE = import.meta.env.VITE_API_URL || ''

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isRegister = mode === 'register'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)

    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const payload = {
        email,
        password,
        ...(isRegister ? { name, country } : {}),
      }

      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Unexpected error')
        return
      }

      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6 p-8 bg-white shadow rounded-lg">
        <h1 className="text-2xl font-semibold">{isRegister ? 'Create an account' : 'Sign in to OctaPay'}</h1>
        <p className="text-sm text-slate-600">
          {isRegister
            ? 'Create an account to start using your Stellar testnet wallet.'
            : 'Sign in with your email and password to access your wallet.'}
        </p>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Full Name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Country</span>
                <input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. India"
                />
              </label>
            </>
          )}

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              placeholder="you@example.com"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              placeholder="••••••••"
            />
          </label>

          {isRegister && (
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Confirm password</span>
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                type="password"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                placeholder="••••••••"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-70"
          >
            {loading ? 'Working…' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <div className="text-center text-sm text-slate-600">
          {isRegister ? (
            <>
              Already have an account?{' '}
              <button className="font-semibold text-indigo-600 hover:text-indigo-500" onClick={() => setMode('login')}>
                Sign in
              </button>
            </>
          ) : (
            <>
              New to OctaPay?{' '}
              <button className="font-semibold text-indigo-600 hover:text-indigo-500" onClick={() => setMode('register')}>
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
