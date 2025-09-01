import { useState, useEffect, useCallback } from 'react'
import { doc, setDoc, onSnapshot, collection, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'

export interface OnlineUser {
  id: string
  username: string
  role: 'dev' | 'funcionario'
  isOnline: boolean
  lastSeen: Date
}

export function useOnlineStatusSimple() {
  const [isOnline, setIsOnline] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Função para ficar online
  const goOnline = useCallback(async () => {
    if (!user) return
    
    try {
      setError(null)
      const userRef = doc(db, 'online_users', user.id)
      await setDoc(userRef, {
        id: user.id,
        username: user.username || 'Usuário',
        role: user.type || 'funcionario',
        isOnline: true,
        lastSeen: serverTimestamp()
      })
      setIsOnline(true)
    } catch (err) {
      console.error('Erro ao ficar online:', err)
      setError('Erro ao conectar')
    }
  }, [user])

  // Função para ficar offline
  const goOffline = useCallback(async () => {
    if (!user) return
    
    try {
      setError(null)
      const userRef = doc(db, 'online_users', user.id)
      await setDoc(userRef, {
        id: user.id,
        username: user.username || 'Usuário',
        role: user.type || 'funcionario',
        isOnline: false,
        lastSeen: serverTimestamp()
      })
      setIsOnline(false)
    } catch (err) {
      console.error('Erro ao ficar offline:', err)
      setError('Erro ao desconectar')
    }
  }, [user])

  // Escutar mudanças nos usuários online
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let unsubscribe: (() => void) | undefined

    const setupListener = () => {
      try {
        setError(null)
        
        // Query simples para usuários online
        const q = query(
          collection(db, 'online_users'),
          where('isOnline', '==', true)
        )

        unsubscribe = onSnapshot(q, (snapshot) => {
          const users: OnlineUser[] = []
          snapshot.forEach((doc) => {
            const data = doc.data()
            if (data && data.isOnline) {
              users.push({
                id: data.id,
                username: data.username,
                role: data.role,
                isOnline: data.isOnline,
                lastSeen: data.lastSeen?.toDate() || new Date()
              })
            }
          })
          setOnlineUsers(users)
          setLoading(false)
        }, (err) => {
          console.error('Erro no listener:', err)
          setError('Erro de conexão')
          setLoading(false)
        })

        // Verificar status do usuário atual
        const userRef = doc(db, 'online_users', user.id)
        const userUnsubscribe = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data()
            setIsOnline(data.isOnline || false)
          } else {
            setIsOnline(false)
          }
        }, (err) => {
          console.error('Erro ao verificar status:', err)
          setIsOnline(false)
        })

        return () => {
          if (userUnsubscribe) {
            userUnsubscribe()
          }
        }

      } catch (err) {
        console.error('Erro ao configurar listener:', err)
        setError('Erro de configuração')
        setLoading(false)
      }
    }

    const cleanup = setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      if (cleanup) {
        cleanup()
      }
    }
  }, [user])

  // Marcar como offline quando a página for fechada
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isOnline && user) {
        // Usar navigator.sendBeacon se disponível
        if (navigator.sendBeacon) {
          const data = JSON.stringify({
            id: user.id,
            username: user.username || 'Usuário',
            role: user.type || 'funcionario',
            isOnline: false,
            lastSeen: new Date().toISOString()
          })
          navigator.sendBeacon('/api/online-status', data)
        } else {
          // Fallback para setDoc
          const userRef = doc(db, 'online_users', user.id)
          setDoc(userRef, {
            id: user.id,
            username: user.username || 'Usuário',
            role: user.type || 'funcionario',
            isOnline: false,
            lastSeen: serverTimestamp()
          }).catch(console.error)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isOnline, user])

  return {
    isOnline,
    onlineUsers,
    loading,
    error,
    goOnline,
    goOffline
  }
}
