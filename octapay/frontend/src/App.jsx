import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Invest from './pages/Invest'
import Borrow from './pages/Borrow'
import Spend from './pages/Spend'
import Profile from './pages/Profile'
import Transactions from './pages/Transactions'
import Explorer from './pages/Explorer'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface)', color: 'var(--text)' }}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RedirectIfAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--surface)', color: 'var(--text)' }}>Loading...</div>
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AppContent() {
  const { user } = useAuth()
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/'

  return (
    <div style={{ display: 'flex' }}>
      <Navbar />
      <main className={user && !isAuthPage ? 'with-sidebar' : ''} style={{ flex: 1, minHeight: '100vh', marginLeft: user && !isAuthPage ? '56px' : '0', transition: 'margin-left 250ms ease' }}>
        <Routes>
          <Route path="/" element={<RedirectIfAuth><Landing /></RedirectIfAuth>} />
          <Route path="/login" element={<RedirectIfAuth><Login /></RedirectIfAuth>} />
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/invest" element={<RequireAuth><Invest /></RequireAuth>} />
          <Route path="/borrow" element={<RequireAuth><Borrow /></RequireAuth>} />
          <Route path="/spend" element={<RequireAuth><Spend /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/transactions" element={<RequireAuth><Transactions /></RequireAuth>} />
          <Route path="/explorer" element={<RequireAuth><Explorer /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}
