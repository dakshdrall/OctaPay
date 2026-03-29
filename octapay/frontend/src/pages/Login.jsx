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

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      backgroundColor: 'var(--surface)',
    },
    grid: {
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
      },
    },
    formSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 'var(--spacing-3xl)',
      backgroundColor: 'var(--surface)',
      animation: 'slideInRight 600ms ease-out',
    },
    brandSection: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--spacing-3xl)',
      backgroundColor: 'var(--surface-2)',
      borderLeft: '1px solid hsl(220, 12%, 20%)',
      position: 'relative',
      overflow: 'hidden',
    },
    brandGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(0, 200, 255, 0.02) 100%)',
      pointerEvents: 'none',
    },
    brandContent: {
      position: 'relative',
      zIndex: 1,
      textAlign: 'center',
    },
    logo: {
      fontSize: '4rem',
      marginBottom: 'var(--spacing-2xl)',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--accent)',
      animation: 'fadeInScaleUp 700ms ease-out',
    },
    brandTitle: {
      fontSize: '1.875rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text)',
      marginBottom: 'var(--spacing-lg)',
      letterSpacing: '-0.02em',
    },
    brandSubtitle: {
      fontSize: '1rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
      marginBottom: 'var(--spacing-2xl)',
      maxWidth: '300px',
      lineHeight: 1.6,
    },
    brandFeatures: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-xl)',
      marginTop: 'var(--spacing-2xl)',
    },
    feature: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--spacing-lg)',
      animation: 'fadeInUp 600ms ease-out forwards',
    },
    featureIcon: {
      fontSize: '1.5rem',
      minWidth: '1.5rem',
      color: 'var(--accent)',
    },
    featureText: {
      textAlign: 'left',
    },
    featureLabel: {
      fontSize: '0.875rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      color: 'var(--text)',
      marginBottom: '0.25rem',
    },
    featureDesc: {
      fontSize: '0.8125rem',
      color: 'var(--text-muted)',
      lineHeight: 1.5,
    },
    formWrapper: {
      maxWidth: '400px',
      animation: 'fadeInUp 600ms ease-out',
    },
    header: {
      marginBottom: 'var(--spacing-2xl)',
    },
    title: {
      fontSize: '2rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--text)',
      marginBottom: 'var(--spacing-md)',
      letterSpacing: '-0.02em',
    },
    subtitle: {
      fontSize: '0.9375rem',
      color: 'var(--text-muted)',
      lineHeight: 1.6,
      fontFamily: 'var(--font-mono)',
    },
    errorBox: {
      padding: 'var(--spacing-md) var(--spacing-lg)',
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
      border: '1px solid rgba(255, 0, 0, 0.2)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--danger)',
      fontSize: '0.875rem',
      fontFamily: 'var(--font-mono)',
      marginBottom: 'var(--spacing-lg)',
      animation: 'fadeInUp 300ms ease-out',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-lg)',
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)',
      animation: 'fadeInUp 600ms ease-out forwards',
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
    submitButton: {
      backgroundColor: 'var(--cta)',
      color: 'var(--surface)',
      border: 'none',
      borderRadius: 'var(--radius-md)',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: '1rem',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 300ms ease-out',
      opacity: loading ? 0.7 : 1,
      transform: 'translateY(0)',
    },
    toggleMode: {
      marginTop: 'var(--spacing-xl)',
      textAlign: 'center',
      fontSize: '0.875rem',
      color: 'var(--text-muted)',
      fontFamily: 'var(--font-mono)',
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      color: 'var(--accent)',
      cursor: 'pointer',
      fontWeight: 600,
      textDecoration: 'underline',
      padding: 0,
      marginLeft: '0.25rem',
      fontFamily: 'var(--font-mono)',
      fontSize: 'inherit',
      transition: 'color 300ms ease-out',
    },
    '@media (max-width: 768px)': {
      container: {
        gridTemplateColumns: '1fr',
      },
      brandSection: {
        display: 'none',
      },
      formSection: {
        padding: 'var(--spacing-2xl) var(--spacing-lg)',
      },
    },
  }

  return (
    <div style={styles.container}>
      {/* Brand Section */}
      <div style={styles.brandSection}>
        <div style={styles.brandGradient} />
        <div style={styles.brandContent}>
          <div style={styles.logo}>◆</div>
          <h1 style={styles.brandTitle}>OctaPay</h1>
          <p style={styles.brandSubtitle}>
            Your gateway to transparent, blockchain-backed financial services.
          </p>
          <div style={styles.brandFeatures}>
            <div style={{ ...styles.feature, animationDelay: '100ms' }}>
              <div style={styles.featureIcon}>→</div>
              <div style={styles.featureText}>
                <div style={styles.featureLabel}>Instant Transfers</div>
                <div style={styles.featureDesc}>Send USDC globally with minimal fees</div>
              </div>
            </div>
            <div style={{ ...styles.feature, animationDelay: '200ms' }}>
              <div style={styles.featureIcon}>⟳</div>
              <div style={styles.featureText}>
                <div style={styles.featureLabel}>Earn on Holdings</div>
                <div style={styles.featureDesc}>Invest and grow your portfolio on Stellar</div>
              </div>
            </div>
            <div style={{ ...styles.feature, animationDelay: '300ms' }}>
              <div style={styles.featureIcon}>◈</div>
              <div style={styles.featureText}>
                <div style={styles.featureLabel}>Transparent Ledger</div>
                <div style={styles.featureDesc}>Every transaction verified on-chain</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div style={styles.formSection}>
        <div style={styles.formWrapper}>
          <div style={styles.header}>
            <h1 style={styles.title}>{isRegister ? 'Join OctaPay' : 'Welcome Back'}</h1>
            <p style={styles.subtitle}>
              {isRegister
                ? 'Create an account to access your Stellar testnet wallet.'
                : 'Sign in to continue to your dashboard.'}
            </p>
          </div>

          {error && <div style={styles.errorBox}>{error}</div>}

          <form style={styles.form} onSubmit={handleSubmit}>
            {isRegister && (
              <>
                <div style={{ ...styles.fieldGroup, animationDelay: '0ms' }}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={styles.input}
                    placeholder="Your name"
                  />
                </div>
                <div style={{ ...styles.fieldGroup, animationDelay: '100ms' }}>
                  <label style={styles.label}>Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={styles.input}
                    placeholder="e.g. India"
                  />
                </div>
              </>
            )}

            <div style={{ ...styles.fieldGroup, animationDelay: isRegister ? '200ms' : '0ms' }}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="you@example.com"
              />
            </div>

            <div style={{ ...styles.fieldGroup, animationDelay: isRegister ? '300ms' : '100ms' }}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="••••••••"
              />
            </div>

            {isRegister && (
              <div style={{ ...styles.fieldGroup, animationDelay: '400ms' }}>
                <label style={styles.label}>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={styles.input}
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.opacity = '0.9'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 200, 160, 0.3)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.opacity = '1'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }
              }}
            >
              {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style={styles.toggleMode}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              style={styles.toggleButton}
              onClick={() => {
                setMode(isRegister ? 'login' : 'register')
                setError(null)
              }}
            >
              {isRegister ? 'Sign In' : 'Create One'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
