import { useState, useEffect, useCallback } from 'react'
import { doc, setDoc, onSnapshot, collection, query, where, orderBy, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'

export interface OnlineUser {
  id: string
  username: string
  role: 'dev' | 'funcionario'
  isOnline: boolean
  lastSeen: Date
  avatar?: string
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Função para ficar online
  const goOnline = useCallback(async () => {
    if (!user) return
    
    try {
      const userRef = doc(db, 'online_users', user.id)
      await setDoc(userRef, {
        id: user.id,
        username: user.username || 'Usuário',
        role: user.type || 'funcionario',
        isOnline: true,
        lastSeen: serverTimestamp(),
        avatar: null
      })
      setIsOnline(true)
    } catch (error) {
      console.error('Erro ao ficar online:', error)
    }
  }, [user])

  // Função para ficar offline
  const goOffline = useCallback(async () => {
    if (!user) return
    
    try {
      const userRef = doc(db, 'online_users', user.id)
      await setDoc(userRef, {
        id: user.id,
        username: user.username || 'Usuário',
        role: user.type || 'funcionario',
        isOnline: false,
        lastSeen: serverTimestamp(),
        avatar: null
      })
      setIsOnline(false)
    } catch (error) {
      console.error('Erro ao ficar offline:', error)
    }
  }, [user])

  // Função para atualizar lastSeen
  const updateLastSeen = useCallback(async () => {
    if (!user || !isOnline) return
    
    try {
      const userRef = doc(db, 'online_users', user.id)
      await setDoc(userRef, {
        lastSeen: serverTimestamp()
      }, { merge: true })
    } catch (error) {
      console.error('Erro ao atualizar lastSeen:', error)
    }
  }, [user, isOnline])

  // Escutar mudanças nos usuários online
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let unsubscribeUsers: (() => void) | undefined
    let unsubscribeUser: (() => void) | undefined

    const setupListeners = async () => {
      try {
        // Query para usuários online
        const q = query(
          collection(db, 'online_users'),
          where('isOnline', '==', true)
        )

        unsubscribeUsers = onSnapshot(q, (snapshot) => {
          const users: OnlineUser[] = []
          snapshot.forEach((doc) => {
            const data = doc.data()
            if (data && data.isOnline) {
              users.push({
                id: data.id,
                username: data.username,
                role: data.role,
                isOnline: data.isOnline,
                lastSeen: data.lastSeen?.toDate() || new Date(),
                avatar: data.avatar
              })
            }
          })
          setOnlineUsers(users)
          setLoading(false)
        }, (error) => {
          console.error('Erro ao escutar usuários online:', error)
          setLoading(false)
        })

        // Verificar status do usuário atual
        const userRef = doc(db, 'online_users', user.id)
        unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data()
            setIsOnline(data.isOnline || false)
          } else {
            setIsOnline(false)
          }
        }, (error) => {
          console.error('Erro ao verificar status do usuário:', error)
          setIsOnline(false)
        })

      } catch (error) {
        console.error('Erro ao configurar listeners:', error)
        setLoading(false)
      }
    }

    setupListeners()

    return () => {
      if (unsubscribeUsers) {
        unsubscribeUsers()
      }
      if (unsubscribeUser) {
        unsubscribeUser()
      }
    }
  }, [user])

  // Atualizar lastSeen periodicamente quando online
  useEffect(() => {
    if (!isOnline) return

    const interval = setInterval(updateLastSeen, 30000) // A cada 30 segundos

    return () => clearInterval(interval)
  }, [isOnline, updateLastSeen])

  // Marcar como offline quando a página for fechada
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isOnline && user) {
        // Usar sendBeacon para garantir que a requisição seja enviada
        const userRef = doc(db, 'online_users', user.id)
        setDoc(userRef, {
          id: user.id,
          username: user.username || 'Usuário',
          role: user.type || 'funcionario',
          isOnline: false,
          lastSeen: serverTimestamp(),
          avatar: null
        }).catch(console.error)
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isOnline) {
        goOffline()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isOnline, user, goOffline])

  return {
    isOnline,
    onlineUsers,
    loading,
    goOnline,
    goOffline,
    updateLastSeen
  }
}
