import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Invest from './pages/Invest'
import Borrow from './pages/Borrow'
import Spend from './pages/Spend'
import Profile from './pages/Profile'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function RedirectIfAuth({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <RedirectIfAuth>
                <Landing />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <Login />
              </RedirectIfAuth>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/invest"
            element={
              <RequireAuth>
                <Invest />
              </RequireAuth>
            }
          />
          <Route
            path="/borrow"
            element={
              <RequireAuth>
                <Borrow />
              </RequireAuth>
            }
          />
          <Route
            path="/spend"
            element={
              <RequireAuth>
                <Spend />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
