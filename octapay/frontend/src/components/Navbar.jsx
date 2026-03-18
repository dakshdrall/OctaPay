import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">
          OctaPay
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="text-sm text-slate-700 hover:text-slate-900">
            Dashboard
          </Link>
          <Link to="/invest" className="text-sm text-slate-700 hover:text-slate-900">
            Invest
          </Link>
          <Link to="/borrow" className="text-sm text-slate-700 hover:text-slate-900">
            Borrow
          </Link>
          <Link to="/spend" className="text-sm text-slate-700 hover:text-slate-900">
            Spend
          </Link>
        </div>
      </nav>
    </header>
  )
}
