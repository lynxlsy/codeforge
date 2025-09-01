"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { DevUser } from "@/lib/dev-auth-config"

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
    // Verificar sessão salva
    const savedSessionId = localStorage.getItem("cdforge-dev-session")
    console.log('🔍 Verificando sessão salva:', savedSessionId)
    if (savedSessionId) {
      validateSavedSession(savedSessionId)
    } else {
      console.log('🔍 Nenhuma sessão encontrada')
      setLoading(false)
    }
  }, [])

  // Detectar quando o usuário sai da página e marcar como offline
  useEffect(() => {
    // Só adicionar listeners se estiver autenticado
    if (!user || !isAuthenticated) return

    const handleBeforeUnload = async () => {
      try {
        const { updateEmployeeOnlineStatus } = await import('@/lib/predefined-employees')
        await updateEmployeeOnlineStatus(user.username, 'offline')
      } catch (error) {
        console.error('Erro ao marcar como offline:', error)
      }
    }

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        try {
          const { updateEmployeeOnlineStatus } = await import('@/lib/predefined-employees')
          await updateEmployeeOnlineStatus(user.username, 'offline')
        } catch (error) {
          console.error('Erro ao marcar como offline:', error)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [user?.username, isAuthenticated]) // Usar apenas username como dependência

  const validateSavedSession = async (sessionId: string) => {
    try {
      // Para sessões locais, verificar se existe e recuperar dados do usuário
      if (sessionId.startsWith('local_session_')) {
        const userData = localStorage.getItem("cdforge-user-data")
        if (userData) {
          try {
            const user = JSON.parse(userData) as DevUser
            console.log('✅ Sessão local válida, recuperando dados do usuário:', user.username)
            setIsAuthenticated(true)
            setUser(user)
            setSessionId(sessionId)
          } catch (parseError) {
            console.error('Erro ao parsear dados do usuário:', parseError)
            localStorage.removeItem("cdforge-dev-session")
            localStorage.removeItem("cdforge-user-data")
            setIsAuthenticated(false)
            setUser(null)
            setSessionId(null)
          }
        } else {
          console.log('Sessão local encontrada, mas dados do usuário não disponíveis')
          localStorage.removeItem("cdforge-dev-session")
          setIsAuthenticated(false)
          setUser(null)
          setSessionId(null)
        }
      } else {
        // Sessão inválida, limpar
        localStorage.removeItem("cdforge-dev-session")
        localStorage.removeItem("cdforge-user-data")
        setIsAuthenticated(false)
        setUser(null)
        setSessionId(null)
      }
    } catch (error) {
      console.error('Erro ao validar sessão:', error)
      localStorage.removeItem("cdforge-dev-session")
      localStorage.removeItem("cdforge-user-data")
      setIsAuthenticated(false)
      setUser(null)
      setSessionId(null)
    } finally {
      setLoading(false)
    }
  }

  const login = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // IMPORTANTE: Login local primeiro (código fonte)
      const { validateCredentials } = await import('@/lib/dev-auth-config')
      const localUser = validateCredentials(username, password)
      
      if (!localUser) {
        console.log('❌ Usuário não encontrado no código fonte')
        return false
      }
      
      console.log('✅ Usuário validado localmente:', localUser)
      
      // Criar usuário para o contexto (sem Firebase)
      const user: DevUser = {
        id: localUser.username,
        username: localUser.username,
        name: localUser.name,
        email: localUser.email,
        role: localUser.role,
        type: localUser.type,
        lastLogin: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isActive: true
      }
      
      // Criar sessão local (sem Firebase)
      const sessionId = `local_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Salvar sessão e dados do usuário localmente
      localStorage.setItem("cdforge-dev-session", sessionId)
      localStorage.setItem("cdforge-user-data", JSON.stringify(user))
      
      // Atualizar estado
      setIsAuthenticated(true)
      setUser(user)
      setSessionId(sessionId)
      
      // SÓ DEPOIS: Sincronizar com Firebase para status online
      try {
        const { updateEmployeeOnlineStatus } = await import('@/lib/predefined-employees')
        await updateEmployeeOnlineStatus(username, 'online')
        console.log('✅ Usuário marcado como online no Firebase')
      } catch (onlineError) {
        console.error('Erro ao marcar como online no Firebase:', onlineError)
        // Não falha o login se o Firebase der erro
      }
      
      return true
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      // Marcar usuário como offline no Firebase (se disponível)
      if (user) {
        try {
          const { updateEmployeeOnlineStatus } = await import('@/lib/predefined-employees')
          await updateEmployeeOnlineStatus(user.username, 'offline')
          console.log('✅ Usuário marcado como offline no Firebase')
        } catch (offlineError) {
          console.error('Erro ao marcar como offline no Firebase:', offlineError)
          // Não falha o logout se o Firebase der erro
        }
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      // Limpar estado local
      setIsAuthenticated(false)
      setUser(null)
      setSessionId(null)
      localStorage.removeItem("cdforge-dev-session")
      localStorage.removeItem("cdforge-user-data")
      setLoading(false)
    }
  }, [user])

  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      const savedSessionId = localStorage.getItem("cdforge-dev-session")
      if (!savedSessionId) {
        setIsAuthenticated(false)
        setUser(null)
        setSessionId(null)
        return false
      }

      // Para sessões locais, verificar se existe e recuperar dados do usuário
      if (savedSessionId.startsWith('local_session_')) {
        const userData = localStorage.getItem("cdforge-user-data")
        if (userData) {
          try {
            const user = JSON.parse(userData) as DevUser
            console.log('✅ Sessão local válida, recuperando dados do usuário:', user.username)
            setIsAuthenticated(true)
            setUser(user)
            setSessionId(savedSessionId)
            return true
          } catch (parseError) {
            console.error('Erro ao parsear dados do usuário:', parseError)
            localStorage.removeItem("cdforge-dev-session")
            localStorage.removeItem("cdforge-user-data")
            setIsAuthenticated(false)
            setUser(null)
            setSessionId(null)
            return false
          }
        } else {
          console.log('Sessão local encontrada, mas dados do usuário não disponíveis')
          localStorage.removeItem("cdforge-dev-session")
          localStorage.removeItem("cdforge-user-data")
          setIsAuthenticated(false)
          setUser(null)
          setSessionId(null)
          return false
        }
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
  }, [])

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
