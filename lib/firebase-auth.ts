import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { validateCredentials, getUserByUsername, SECURITY_CONFIG } from './dev-auth-config'

export interface DevUser {
  id: string
  username: string
  name: string
  email: string
  role: 'admin' | 'dev' | 'viewer'
  lastLogin: string
  createdAt: string
  isActive: boolean
}

export interface DevSession {
  userId: string
  sessionId: string
  deviceInfo: {
    userAgent: string
    platform: string
    screenSize: string
  }
  lastActivity: string
  expiresAt: string
}

class FirebaseAuthService {
  private static readonly SESSION_DURATION = SECURITY_CONFIG.sessionDuration

  // Verificar se usuário existe e é válido
  static async validateUser(username: string, password: string): Promise<DevUser | null> {
    try {
      // Verificar se as credenciais estão na lista autorizada
      const authorizedUser = validateCredentials(username, password)

      if (!authorizedUser) {
        return null
      }

      // Verificar se o usuário existe no Firebase, se não, criar
      const userRef = doc(db, 'dev-users', username)
      const userDoc = await getDoc(userRef)
      
      if (!userDoc.exists()) {
        // Criar usuário no Firebase
        const newUser: DevUser = {
          id: username,
          username: authorizedUser.username,
          name: authorizedUser.name,
          email: authorizedUser.email,
          role: authorizedUser.role,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          isActive: true
        }
        
        await setDoc(userRef, newUser)
        console.log(`Usuário ${username} criado no Firebase`)
        return newUser
      }

      const userData = userDoc.data() as DevUser
      return userData
    } catch (error) {
      console.error('Erro ao validar usuário:', error)
      return null
    }
  }

  // Criar sessão no Firebase
  static async createSession(user: DevUser): Promise<DevSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date()
    const expiresAt = new Date(now.getTime() + this.SESSION_DURATION)

    const session: DevSession = {
      userId: user.id,
      sessionId,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenSize: `${screen.width}x${screen.height}`
      },
      lastActivity: now.toISOString(),
      expiresAt: expiresAt.toISOString()
    }

    // Salvar sessão no Firebase
    const sessionRef = doc(db, 'dev-sessions', sessionId)
    await setDoc(sessionRef, session)

    // Atualizar último login do usuário
    const userRef = doc(db, 'dev-users', user.id)
    await setDoc(userRef, {
      ...user,
      lastLogin: now.toISOString()
    }, { merge: true })

    return session
  }

  // Verificar sessão ativa
  static async validateSession(sessionId: string): Promise<DevUser | null> {
    try {
      const sessionRef = doc(db, 'dev-sessions', sessionId)
      const sessionDoc = await getDoc(sessionRef)
      
      if (!sessionDoc.exists()) {
        return null
      }

      const session = sessionDoc.data() as DevSession
      const now = new Date()
      const expiresAt = new Date(session.expiresAt)

      // Verificar se a sessão expirou
      if (now > expiresAt) {
        await this.removeSession(sessionId)
        return null
      }

      // Buscar dados do usuário
      const userRef = doc(db, 'dev-users', session.userId)
      const userDoc = await getDoc(userRef)
      
      if (!userDoc.exists()) {
        await this.removeSession(sessionId)
        return null
      }

      const user = userDoc.data() as DevUser
      
      // Atualizar última atividade
      await setDoc(sessionRef, {
        ...session,
        lastActivity: now.toISOString()
      }, { merge: true })

      return user
    } catch (error) {
      console.error('Erro ao validar sessão:', error)
      return null
    }
  }

  // Remover sessão
  static async removeSession(sessionId: string): Promise<void> {
    try {
      const sessionRef = doc(db, 'dev-sessions', sessionId)
      await setDoc(sessionRef, { deleted: true }, { merge: true })
    } catch (error) {
      console.error('Erro ao remover sessão:', error)
    }
  }

  // Listar sessões ativas de um usuário
  static async getUserSessions(userId: string): Promise<DevSession[]> {
    try {
      // Implementar query para buscar sessões do usuário
      // Por enquanto, retornar array vazio
      return []
    } catch (error) {
      console.error('Erro ao buscar sessões:', error)
      return []
    }
  }

  // Listar todos os usuários DEV (para debug)
  static async listAllUsers(): Promise<DevUser[]> {
    try {
      const { getAuthorizedUsers } = await import('./dev-auth-config')
      const authorizedUsers = getAuthorizedUsers()

      const users: DevUser[] = []
      
      for (const userData of authorizedUsers) {
        const userRef = doc(db, 'dev-users', userData.username)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          users.push(userDoc.data() as DevUser)
        }
      }

      return users
    } catch (error) {
      console.error('Erro ao listar usuários:', error)
      return []
    }
  }

  // Inicializar usuários padrão se não existirem
  static async initializeDefaultUser(): Promise<void> {
    try {
      const { getAuthorizedUsers } = await import('./dev-auth-config')
      const authorizedUsers = getAuthorizedUsers()

      for (const userData of authorizedUsers) {
        const userRef = doc(db, 'dev-users', userData.username)
        const userDoc = await getDoc(userRef)
        
        if (!userDoc.exists()) {
          const defaultUser: DevUser = {
            id: userData.username,
            username: userData.username,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isActive: true
          }
          
          await setDoc(userRef, defaultUser)
          console.log(`Usuário ${userData.username} criado no Firebase`)
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar usuários padrão:', error)
    }
  }
}

export { FirebaseAuthService }
