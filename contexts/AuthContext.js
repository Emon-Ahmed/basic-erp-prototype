"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

// Sample users
const SAMPLE_USERS = [
  { id: 1, name: "Admin User", email: "admin@tex.com", role: "admin", password: "admin123" },
  { id: 2, name: "Production Manager", email: "manager@tex.com", role: "manager", password: "manager123" },
  { id: 3, name: "Factory Worker", email: "worker@tex.com", role: "worker", password: "worker123" },
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("textrack_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const foundUser = SAMPLE_USERS.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password
      setUser(userWithoutPassword)
      localStorage.setItem("textrack_user", JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    return { success: false, error: "Invalid credentials" }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("textrack_user")
  }

  const register = (userData) => {
    // Mock registration - in real app would call API
    const newUser = {
      id: Date.now(),
      ...userData,
      role: "worker", // Default role
    }
    return { success: true, user: newUser }
  }

  return <AuthContext.Provider value={{ user, login, logout, register, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
