import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@hemvar.no',
    password: 'admin123',
    name: 'Kari Nordmann',
    role: 'admin',
    organization: 'Solsiden Borettslag',
  },
  {
    id: '2',
    email: 'bruker@hemvar.no',
    password: 'bruker123',
    name: 'Ola Hansen',
    role: 'styremedlem',
    organization: 'Solsiden Borettslag',
  },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hemvar_user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem('hemvar_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('hemvar_user')
    }
  }, [user])

  const login = (email, password) => {
    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    )
    if (!found) return { success: false, error: 'Feil e-post eller passord' }
    const { password: _, ...userData } = found
    setUser(userData)
    return { success: true }
  }

  const register = (data) => {
    const newUser = {
      id: String(Date.now()),
      email: data.email,
      name: `${data.firstName} ${data.lastName}`,
      role: 'styremedlem',
      organization: data.organization,
    }
    setUser(newUser)
    return { success: true }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
