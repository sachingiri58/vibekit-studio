// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth as authApi } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore user from localStorage (token is in httpOnly cookie)
  useEffect(() => {
    const stored = localStorage.getItem('vk_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    const data = await authApi.login({ email, password })
    setUser(data.user)
    localStorage.setItem('vk_user', JSON.stringify(data.user))
    // Also store token for Authorization header fallback
    if (data.token) localStorage.setItem('vk_token', data.token)
    return data
  }

  async function signup(name, email, password) {
    const data = await authApi.signup({ name, email, password })
    setUser(data.user)
    localStorage.setItem('vk_user', JSON.stringify(data.user))
    if (data.token) localStorage.setItem('vk_token', data.token)
    return data
  }

  async function logout() {
    try { await authApi.logout() } catch {}
    setUser(null)
    localStorage.removeItem('vk_user')
    localStorage.removeItem('vk_token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
