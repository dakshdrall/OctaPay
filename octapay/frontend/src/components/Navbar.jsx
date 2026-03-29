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

  const isAuthenticated = !!user

  const sidebarStyles = {
    sidebar: {
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: expanded ? '200px' : '64px',
      backgroundColor: 'var(--surface-2)',
      borderRight: '1px solid hsl(220, 12%, 20%)',
      transition: 'width 300ms ease-out',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      padding: 'var(--spacing-md) 0',
      boxShadow: 'var(--shadow-lg)',
    },
    header: {
      padding: 'var(--spacing-md)',
      textAlign: 'center',
      borderBottom: '1px solid hsl(220, 12%, 20%)',
      marginBottom: 'var(--spacing-lg)',
    },
    logo: {
      fontFamily: 'var(--font-display)',
      fontSize: expanded ? '1.5rem' : '1.25rem',
      fontWeight: 700,
      color: 'var(--accent)',
      transition: 'all 300ms ease-out',
    },
    navList: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-sm)',
      padding: '0 var(--spacing-sm)',
      overflowY: 'auto',
    },
    navItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      borderRadius: 'var(--radius-lg)',
      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
      textDecoration: 'none',
      transition: 'all 300ms ease-out',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: isActive ? 600 : 400,
      backgroundColor: isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent',
      border: isActive ? '1px solid rgba(0, 255, 255, 0.2)' : '1px solid transparent',
      position: 'relative',
      overflow: 'hidden',
    }),
    icon: {
      fontSize: '1.25rem',
      minWidth: '1.5rem',
      textAlign: 'center',
    },
    label: {
      whiteSpace: 'nowrap',
      opacity: expanded ? 1 : 0,
      transition: 'opacity 300ms ease-out',
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
    },
    footer: {
      padding: 'var(--spacing-lg) var(--spacing-md)',
      borderTop: '1px solid hsl(220, 12%, 20%)',
      marginTop: 'auto',
    },
    userInfo: {
      marginBottom: 'var(--spacing-lg)',
      padding: 'var(--spacing-md) var(--spacing-lg)',
      backgroundColor: 'rgba(0, 255, 255, 0.05)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(0, 255, 255, 0.1)',
      transition: 'all 300ms ease-out',
    },
    userName: {
      fontSize: '0.75rem',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '0.25rem',
    },
    userEmail: {
      fontSize: expanded ? '0.75rem' : '0.625rem',
      color: 'var(--accent)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    toggleButton: {
      background: 'transparent',
      border: '1px solid hsl(220, 12%, 20%)',
      color: 'var(--text-muted)',
      padding: 'var(--spacing-md)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'all 300ms ease-out',
      marginBottom: 'var(--spacing-md)',
      fontSize: '0.875rem',
    },
    logoutButton: {
      background: 'rgba(255, 0, 0, 0.1)',
      border: '1px solid rgba(255, 0, 0, 0.2)',
      color: 'var(--danger)',
      padding: expanded ? 'var(--spacing-md) var(--spacing-lg)' : 'var(--spacing-md)',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      transition: 'all 300ms ease-out',
      fontSize: '0.875rem',
      fontFamily: 'var(--font-display)',
      fontWeight: 500,
      width: '100%',
      textAlign: 'center',
    },
  }

  const handleNavItemClick = (e, href) => {
    // Optional: collapse sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      setExpanded(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav style={sidebarStyles.sidebar}>
      <div style={sidebarStyles.header}>
        <div style={sidebarStyles.logo}>◆</div>
      </div>

      <ul style={sidebarStyles.navList}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href} style={{ listStyle: 'none' }}>
              <Link
                to={item.href}
                style={sidebarStyles.navItem(isActive)}
                onClick={(e) => handleNavItemClick(e, item.href)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 255, 255, 0.15)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent'
                  e.currentTarget.style.color = isActive ? 'var(--accent)' : 'var(--text-muted)'
                }}
              >
                <span style={sidebarStyles.icon}>{item.icon}</span>
                <span style={sidebarStyles.label}>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div style={sidebarStyles.footer}>
        {isAuthenticated && (
          <>
            <div style={sidebarStyles.userInfo}>
              <div style={sidebarStyles.userName}>{user?.name?.split(' ')[0] || 'User'}</div>
              <div style={sidebarStyles.userEmail}>{user?.email}</div>
            </div>
            <button
              style={sidebarStyles.toggleButton}
              onClick={() => setExpanded(!expanded)}
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? '◄' : '►'}
            </button>
            <button
              style={sidebarStyles.logoutButton}
              onClick={logout}
            >
              {expanded ? 'Logout' : '✕'}
            </button>
          </>
        )}
      </div>
    </nav>
  )
}
