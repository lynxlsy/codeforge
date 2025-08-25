"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { FirebaseAuthService, type DevUser } from "@/lib/firebase-auth"

interface AuthContextType {
  isAuthenticated: boolean
  user: DevUser | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuthStatus: () => Promise<boolean>
  loading: boolean
  sessionId: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<DevUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    // Inicializar usuário padrão no Firebase
    FirebaseAuthService.initializeDefaultUser()

    // Verificar sessão salva
    const savedSessionId = localStorage.getItem("cdforge-dev-session")
    if (savedSessionId) {
      validateSavedSession(savedSessionId)
    } else {
      setLoading(false)
    }
  }, [])

  const validateSavedSession = async (sessionId: string) => {
    try {
      const user = await FirebaseAuthService.validateSession(sessionId)
      if (user) {
        setIsAuthenticated(true)
        setUser(user)
        setSessionId(sessionId)
      } else {
        // Sessão inválida, limpar
        localStorage.removeItem("cdforge-dev-session")
        setIsAuthenticated(false)
        setUser(null)
        setSessionId(null)
      }
    } catch (error) {
      console.error('Erro ao validar sessão:', error)
      localStorage.removeItem("cdforge-dev-session")
      setIsAuthenticated(false)
      setUser(null)
      setSessionId(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Validar usuário no Firebase
      const user = await FirebaseAuthService.validateUser(username, password)
      if (!user) {
        return false
      }

      // Criar sessão no Firebase
      const session = await FirebaseAuthService.createSession(user)
      
      // Salvar sessão localmente
      localStorage.setItem("cdforge-dev-session", session.sessionId)
      
      // Atualizar estado
      setIsAuthenticated(true)
      setUser(user)
      setSessionId(session.sessionId)
      
      return true
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Remover sessão do Firebase
      if (sessionId) {
        await FirebaseAuthService.removeSession(sessionId)
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      // Limpar estado local
      setIsAuthenticated(false)
      setUser(null)
      setSessionId(null)
      localStorage.removeItem("cdforge-dev-session")
      setLoading(false)
    }
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const savedSessionId = localStorage.getItem("cdforge-dev-session")
      if (!savedSessionId) {
        setIsAuthenticated(false)
        setUser(null)
        setSessionId(null)
        return false
      }

      const user = await FirebaseAuthService.validateSession(savedSessionId)
      if (user) {
        setIsAuthenticated(true)
        setUser(user)
        setSessionId(savedSessionId)
        return true
      } else {
        // Sessão inválida, limpar
        localStorage.removeItem("cdforge-dev-session")
        setIsAuthenticated(false)
        setUser(null)
        setSessionId(null)
        return false
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error)
      localStorage.removeItem("cdforge-dev-session")
      setIsAuthenticated(false)
      setUser(null)
      setSessionId(null)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuthStatus, loading, sessionId }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
