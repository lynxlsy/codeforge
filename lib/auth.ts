export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "developer" | "user"
  permissions: string[]
  lastLogin?: Date
  createdAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock user database - replace with real database
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  admin: {
    password: "codeforge2024",
    user: {
      id: "1",
      username: "admin",
      email: "admin@codeforge.com",
      role: "admin",
      permissions: ["read", "write", "delete", "manage_users", "manage_system"],
      createdAt: new Date("2024-01-01"),
    },
  },
  dev: {
    password: "Melke",
    user: {
      id: "2",
      username: "dev",
      email: "dev@codeforge.com",
      role: "admin",
      permissions: ["read", "write", "delete", "manage_users", "manage_system", "manage_orders", "manage_plans", "manage_promotions", "manage_contacts"],
      createdAt: new Date("2024-01-01"),
    },
  },
  developer: {
    password: "dev123",
    user: {
      id: "3",
      username: "developer",
      email: "developer@codeforge.com",
      role: "developer",
      permissions: ["read", "write", "manage_projects"],
      createdAt: new Date("2024-01-01"),
    },
  },
}

export class AuthService {
  private static readonly SESSION_KEY = "codeforge_session"
  private static readonly SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

  static async login(username: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = MOCK_USERS[username]
    if (!userData || userData.password !== password) {
      return { success: false, error: "Credenciais inválidas" }
    }

    const user = { ...userData.user, lastLogin: new Date() }
    this.setSession(user)
    return { success: true, user }
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.SESSION_KEY)
      sessionStorage.removeItem(this.SESSION_KEY)
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY)
      if (!sessionData) return null

      const { user, timestamp } = JSON.parse(sessionData)

      // Check if session is expired
      if (Date.now() - timestamp > this.SESSION_DURATION) {
        this.logout()
        return null
      }

      return user
    } catch {
      return null
    }
  }

  static setSession(user: User, rememberMe = false): void {
    if (typeof window === "undefined") return

    const sessionData = {
      user,
      timestamp: Date.now(),
    }

    const storage = rememberMe ? localStorage : sessionStorage
    storage.setItem(this.SESSION_KEY, JSON.stringify(sessionData))
  }

  static hasPermission(user: User | null, permission: string): boolean {
    return user?.permissions.includes(permission) || false
  }

  static isAdmin(user: User | null): boolean {
    return user?.role === "admin" || false
  }

  static refreshSession(): void {
    const user = this.getCurrentUser()
    if (user) {
      this.setSession(user)
    }
  }
}
