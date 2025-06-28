"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "worker"
  avatar?: string
  department: string
  joinDate: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Sample users
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@erp.com",
    role: "admin",
    department: "Management",
    joinDate: "2023-01-15",
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "manager@erp.com",
    role: "manager",
    department: "Production",
    joinDate: "2023-03-20",
  },
  {
    id: "3",
    name: "Mike Worker",
    email: "worker@erp.com",
    role: "worker",
    department: "Production",
    joinDate: "2023-06-10",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = sampleUsers.find((u) => u.email === email)

    if (foundUser && password === "password") {
      setUser(foundUser)
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
