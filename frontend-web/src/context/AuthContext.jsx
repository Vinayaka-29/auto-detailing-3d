import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('cwc_token')
    if (!token) { setLoading(false); return }
    api.get('/auth/me')
      .then(res => setUser(res.user))
      .catch(() => localStorage.removeItem('cwc_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('cwc_token', res.token)
    setUser(res.user)
    return res
  }

  const register = async (data) => {
    const res = await api.post('/auth/register', data)
    localStorage.setItem('cwc_token', res.token)
    setUser(res.user)
    return res
  }

  const logout = () => {
    localStorage.removeItem('cwc_token')
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
