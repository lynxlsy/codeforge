import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import { validateCredentials, getUserByUsername, SECURITY_CONFIG, isDevUser, isFuncionario } from './dev-auth-config'
import { validatePredefinedEmployeeCredentials, logoutPredefinedEmployee } from './predefined-employees'

export interface DevUser {
  id: string
  uid?: string // Campo para compatibilidade com o sistema online
  username: string
  name: string
  email: string
  role: 'admin' | 'dev' | 'funcionario' | 'viewer'
  type: 'dev' | 'funcionario' // Novo campo para diferenciar o tipo de acesso
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
      // Validar com funcionários predefinidos
      const predefinedEmployee = await validatePredefinedEmployeeCredentials(username, password)
      
      if (predefinedEmployee) {
        // Verificar se o usuário existe no Firebase, se não, criar
        const userRef = doc(db, 'dev-users', username)
        const userDoc = await getDoc(userRef)
        
        if (!userDoc.exists()) {
          // Criar usuário no Firebase baseado no funcionário predefinido
          const newUser: DevUser = {
            id: username,
            username: predefinedEmployee.username,
            name: predefinedEmployee.name,
            email: predefinedEmployee.email,
            role: predefinedEmployee.role,
            type: predefinedEmployee.type,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isActive: predefinedEmployee.isActive
          }
          
          await setDoc(userRef, newUser)
          console.log(`✅ Funcionário predefinido ${username} criado no Firebase`)
          return newUser
        }

        const userData = userDoc.data() as DevUser
        return userData
      }

      return null
    } catch (error) {
      console.error('❌ Erro ao validar usuário:', error)
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
      // Nenhum usuário padrão - todos vêm do Firebase
      console.log('ℹ️ Sistema configurado para usar apenas usuários do Firebase')
    } catch (error) {
      console.error('Erro ao inicializar sistema:', error)
    }
  }
}

export { FirebaseAuthService }
