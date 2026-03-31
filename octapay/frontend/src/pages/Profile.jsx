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

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: 'var(--surface)',
      padding: 'var(--spacing-3xl) var(--spacing-2xl)',
    },
    header: {
      marginBottom: 'var(--spacing-2xl)',
      animation: 'fadeInUp 600ms ease-out',
    },
    title: {
      fontSize: '2.5rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text)',
      marginBottom: 'var(--spacing-sm)',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      fontSize: '1rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--spacing-2xl)',
      marginBottom: 'var(--spacing-2xl)',
    },
    card: {
      backgroundColor: 'var(--surface-2)',
      border: '1px solid hsl(220, 12%, 20%)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--spacing-xl)',
      animation: 'fadeInUp 600ms ease-out forwards',
      },
    cardTitle: {
      fontSize: '1.125rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text)',
      marginBottom: 'var(--spacing-lg)',
      letterSpacing: '-0.01em',
    },
    statGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--spacing-lg)',
    },
    statItem: {
      backgroundColor: 'rgba(0, 255, 255, 0.05)',
      border: '1px solid rgba(0, 255, 255, 0.1)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-lg)',
      textAlign: 'center',
    },
    statLabel: {
      fontSize: '0.7rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: 'var(--spacing-sm)',
    },
    statValue: {
      fontSize: '1.5rem',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      color: 'var(--accent)',
    },
    dlGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 'var(--spacing-lg)',
      marginBottom: 'var(--spacing-lg)',
    },
    dlItem: {
      display: 'contents',
    },
    dt: {
      fontSize: '0.875rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
    },
    dd: {
      fontSize: '0.875rem',
      color: 'var(--text)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      wordBreak: 'break-all',
    },
    button: (variant = 'primary') => ({
      padding: 'var(--spacing-md) var(--spacing-lg)',
      borderRadius: 'var(--radius-md)',
      border: variant === 'primary' ? 'none' : '1px solid hsl(220, 12%, 25%)',
      backgroundColor: variant === 'primary' ? 'var(--cta)' : 'transparent',
      color: variant === 'primary' ? 'var(--surface)' : 'var(--text)',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '0.875rem',
      cursor: 'pointer',
      transition: 'all 300ms ease-out',
      width: '100%',
      marginTop: 'var(--spacing-md)',
    }),
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-lg)',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)',
    },
    label: {
      fontSize: '0.8125rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      color: 'var(--text)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    input: {
      backgroundColor: 'var(--surface-2)',
      color: 'var(--text)',
      border: '1px solid hsl(220, 12%, 20%)',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.9375rem',
      transition: 'all 300ms ease-out',
      outline: 'none',
    },
    messageBox: (type) => ({
      padding: 'var(--spacing-md) var(--spacing-lg)',
      borderRadius: 'var(--radius-md)',
      border: `1px solid ${type === 'error' ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 255, 0, 0.2)'}`,
      backgroundColor: type === 'error' ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 0, 0.1)',
      color: type === 'error' ? 'var(--danger)' : 'var(--success)',
      fontSize: '0.875rem',
      fontFamily: 'var(--font-mono)',
      animation: 'fadeInUp 300ms ease-out',
    }),
    '@media (max-width: 1024px)': {
      grid: {
        gridTemplateColumns: '1fr',
      },
      statGrid: {
        gridTemplateColumns: '1fr',
      },
    },
    '@media (max-width: 640px)': {
      container: {
        padding: 'var(--spacing-xl) var(--spacing-lg)',
      },
      title: {
        fontSize: '1.75rem',
      },
    },
  }

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Account Settings</h1>
        <p style={styles.subtitle}>Manage your profile, wallet, and security preferences</p>
      </header>

      {message && <div style={styles.messageBox('success')}>{message}</div>}
      {error && <div style={styles.messageBox('error')}>{error}</div>}

      <div style={styles.grid}>
        {/* Account Info */}
        <div style={{ ...styles.card, animationDelay: '0ms' }}>
          <h2 style={styles.cardTitle}>Account Details</h2>
          <div style={styles.dlGrid}>
            <dt style={styles.dt}>Full Name</dt>
            <dd style={styles.dd}>{user?.name ?? 'N/A'}</dd>

            <dt style={styles.dt}>Email</dt>
            <dd style={styles.dd}>{user?.email ?? 'N/A'}</dd>

            <dt style={styles.dt}>Country</dt>
            <dd style={styles.dd}>{user?.country || 'N/A'}</dd>

            <dt style={styles.dt}>Stellar Wallet</dt>
            <dd style={styles.dd} title={publicKey || ''}>
              {walletLoading ? 'Loading...' : (publicKey ? `${publicKey.slice(0, 10)}...${publicKey.slice(-10)}` : 'Not available')}
            </dd>
          </div>
          <button
            onClick={copyAddress}
            disabled={!publicKey}
            style={{ ...styles.button('primary'), opacity: publicKey ? 1 : 0.5, cursor: publicKey ? 'pointer' : 'not-allowed' }}
            onMouseEnter={(e) => {
              if (publicKey && !e.currentTarget.disabled) {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            📋 Copy Address
          </button>
        </div>

        {/* Stats */}
        <div style={{ ...styles.card, animationDelay: '100ms' }}>
          <h2 style={styles.cardTitle}>Portfolio Stats</h2>
          <div style={styles.statGrid}>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Total Invested</div>
              <div style={styles.statValue}>{totalInvested.toFixed(0)}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Est. Earned</div>
              <div style={styles.statValue}>{totalEarned.toFixed(0)}</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statLabel}>Active Loans</div>
              <div style={styles.statValue}>{loansTaken}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change */}
      <div style={{ ...styles.card, animationDelay: '200ms' }}>
        <h2 style={styles.cardTitle}>Security</h2>
        <form style={styles.form} onSubmit={handlePasswordChange}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            style={{ ...styles.button('primary'), opacity: updating ? 0.7 : 1 }}
            onMouseEnter={(e) => {
              if (!updating) {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {updating ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </main>
  )
}
