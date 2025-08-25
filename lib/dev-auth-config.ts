// Configuração de usuários DEV autorizados
// ⚠️ ATENÇÃO: Este arquivo contém informações sensíveis
// Em produção, use variáveis de ambiente

interface DevUserConfig {
  username: string
  password: string
  name: string
  email: string
  role: 'admin' | 'dev' | 'viewer'
}

// Lista de usuários autorizados
// ⚠️ IMPORTANTE: Em produção, mova estas credenciais para variáveis de ambiente
const DEV_USERS: DevUserConfig[] = [
  {
    username: process.env.DEV_USER_1?.split('=')[0] || 'mllk',
    password: process.env.DEV_USER_1?.split('=')[1] || 'mllk',
    name: 'Admin CDforge',
    email: 'mllk@cdforge.dev',
    role: 'admin'
  },
  {
    username: process.env.DEV_USER_2?.split('=')[0] || 'lynx',
    password: process.env.DEV_USER_2?.split('=')[1] || 'lynx',
    name: 'Lynx Developer',
    email: 'lynx@cdforge.dev',
    role: 'dev'
  },
  {
    username: process.env.DEV_USER_3?.split('=')[0] || 'cd4',
    password: process.env.DEV_USER_3?.split('=')[1] || 'cd4',
    name: 'CD4 Developer',
    email: 'cd4@cdforge.dev',
    role: 'dev'
  }
]

// Função para obter usuários autorizados
export function getAuthorizedUsers(): DevUserConfig[] {
  return DEV_USERS
}

// Função para validar credenciais
export function validateCredentials(username: string, password: string): DevUserConfig | null {
  return DEV_USERS.find(
    user => user.username === username && user.password === password
  ) || null
}

// Função para obter usuário por username
export function getUserByUsername(username: string): DevUserConfig | null {
  return DEV_USERS.find(user => user.username === username) || null
}

// Configurações de segurança
export const SECURITY_CONFIG = {
  sessionDuration: parseInt(process.env.DEV_SESSION_DURATION || '86400000'), // 24 horas
  maxLoginAttempts: parseInt(process.env.DEV_MAX_LOGIN_ATTEMPTS || '5'),
  lockoutDuration: parseInt(process.env.DEV_LOCKOUT_DURATION || '300000'), // 5 minutos
}
