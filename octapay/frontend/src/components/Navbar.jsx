import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Invest', href: '/invest' },
  { label: 'Borrow', href: '/borrow' },
  { label: 'Spend', href: '/spend' },
  { label: 'Transactions', href: '/transactions' },
  { label: 'Profile', href: '/profile' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  return (
    <header className="bg-slate-950 text-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-bold tracking-tight">
            OctaPay
          </Link>
          <span className="hidden sm:inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            {user ? `Hi, ${user.name}` : 'Welcome'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`text-sm font-medium px-3 py-2 rounded-lg transition ${
                pathname === item.href
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {user && (
            <button
              onClick={logout}
              className="text-sm font-medium rounded-lg bg-white/10 px-3 py-2 text-white hover:bg-white/20"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
