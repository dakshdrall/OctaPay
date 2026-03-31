import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '◆' },
  { label: 'Invest', href: '/invest', icon: '↑' },
  { label: 'Borrow', href: '/borrow', icon: '◄' },
  { label: 'Spend', href: '/spend', icon: '→' },
  { label: 'Transactions', href: '/transactions', icon: '⟳' },
  { label: 'Explorer', href: '/explorer', icon: '◈' },
  { label: 'Profile', href: '/profile', icon: '⚙' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const [expanded, setExpanded] = useState(false)

  if (!user) return null

  const W = expanded ? '200px' : '56px'

  return (
    <>
      <nav
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className='sidebar' style={{
          position: 'fixed', left: 0, top: 0, height: '100vh', width: W,
          background: 'var(--surface-2)', borderRight: '1px solid hsl(220,12%,18%)',
          transition: 'width 250ms ease', display: 'flex', flexDirection: 'column',
          zIndex: 1000, overflow: 'hidden',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '1.25rem 0', textAlign: 'center', borderBottom: '1px solid hsl(220,12%,18%)' }}>
          <span style={{ fontSize: '1.4rem', color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>◆</span>
        </div>

        {/* Nav items */}
        <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', padding: '0.75rem 0.5rem', listStyle: 'none', margin: 0, overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link to={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.625rem 0.75rem', borderRadius: '8px',
                  textDecoration: 'none', transition: 'all 200ms ease',
                  color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  background: isActive ? 'rgba(0,255,255,0.08)' : 'transparent',
                  border: isActive ? '1px solid rgba(0,255,255,0.15)' : '1px solid transparent',
                  whiteSpace: 'nowrap', overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,255,0.12)'; e.currentTarget.style.color = 'var(--accent)' }}
                onMouseLeave={e => { e.currentTarget.style.background = isActive ? 'rgba(0,255,255,0.08)' : 'transparent'; e.currentTarget.style.color = isActive ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  <span style={{ fontSize: '1.1rem', minWidth: '1.25rem', textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-display)', fontWeight: 500, opacity: expanded ? 1 : 0, transition: 'opacity 200ms ease' }}>
                    {item.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Footer */}
        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid hsl(220,12%,18%)' }}>
          <div style={{ padding: '0.5rem 0.75rem', marginBottom: '0.5rem', overflow: 'hidden' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {user?.name?.split(' ')[0] || 'User'}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--accent)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', opacity: expanded ? 1 : 0, transition: 'opacity 200ms ease' }}>
              {user?.email}
            </div>
          </div>
          <button onClick={logout} style={{
            width: '100%', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer',
            background: 'rgba(255,0,0,0.08)', border: '1px solid rgba(255,0,0,0.15)',
            color: 'var(--danger)', fontSize: '0.8rem', fontFamily: 'var(--font-display)',
            fontWeight: 500, textAlign: 'center', transition: 'all 200ms ease',
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}>
            {expanded ? 'Logout' : '✕'}
          </button>
        </div>
      </nav>

      {/* Spacer so content doesn't go under sidebar */}
      <div style={{ width: W, flexShrink: 0, transition: 'width 250ms ease' }} />
    </>
  )
}
