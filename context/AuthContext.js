"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for existing session
    const savedUser = localStorage.getItem("user")
    const savedRole = localStorage.getItem("role")

    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser))
      setRole(savedRole)
    }
    setIsLoading(false)
  }, [])

  const login = (userData, userRole) => {
    setUser(userData)
    setRole(userRole)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("role", userRole)
  }

  const logout = () => {
    setUser(null)
    setRole(null)
    localStorage.removeItem("user")
    localStorage.removeItem("role")
  }

  const value = {
    user,
    role,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
