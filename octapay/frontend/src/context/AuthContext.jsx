import { createContext, useContext, useEffect, useState, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || ''
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const userSetFromLogin = useRef(false)

  useEffect(() => {
    const stored = localStorage.getItem('octapay_token')
    if (stored) {
      setToken(stored)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setLoading(false)
      return
    }
    if (userSetFromLogin.current) {
      userSetFromLogin.current = false
      setLoading(false)
      return
    }
    const fetchMe = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Unauthorized')
        const data = await res.json()
        setUser(data.user)
      } catch {
        setUser(null)
        localStorage.removeItem('octapay_token')
        setToken(null)
      } finally {
        setLoading(false)
      }
    }
    fetchMe()
  }, [token])

  const login = (newToken, newUser) => {
    userSetFromLogin.current = true
    localStorage.setItem('octapay_token', newToken)
    setUser(newUser)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('octapay_token')
    setToken(null)
    setUser(null)
  }

  const authFetch = async (path, options = {}) => {
    return fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
