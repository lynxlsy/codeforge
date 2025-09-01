// Configuração de usuários DEV e FUNCIONÁRIOS autorizados
// ⚠️ ATENÇÃO: Este arquivo contém informações sensíveis
// Em produção, use variáveis de ambiente

interface DevUserConfig {
  username: string
  password: string
  name: string
  email: string
  role: 'admin' | 'dev' | 'funcionario' | 'viewer'
  type: 'dev' | 'funcionario' // Novo campo para diferenciar o tipo de acesso
}

// Funcionários predefinidos do sistema
const PREDEFINED_EMPLOYEES: DevUserConfig[] = [
  {
    username: 'dev',
    password: 'D',
    name: 'Dev',
    email: 'dev@cdforge.dev',
    role: 'admin',
    type: 'dev'
  },
  {
    username: 'melke',
    password: 'M7',
    name: 'Melke',
    email: 'melke@cdforge.dev',
    role: 'funcionario',
    type: 'funcionario'
  },
  {
    username: 'ysun',
    password: '122345',
    name: 'Ysun',
    email: 'ysun@cdforge.dev',
    role: 'funcionario',
    type: 'funcionario'
  },
  {
    username: 'pedro',
    password: 'Alice',
    name: 'Pedro',
    email: 'pedro@cdforge.dev',
    role: 'funcionario',
    type: 'funcionario'
  },
  {
    username: 'zanesco',
    password: 'HaxSHW02',
    name: 'Zanesco',
    email: 'zanesco@cdforge.dev',
    role: 'funcionario',
    type: 'funcionario'
  }
]

// Lista de usuários autorizados (apenas para acesso ao painel DEV)
const DEV_USERS: DevUserConfig[] = [
  // USUÁRIO DEV - JAMAIS PODE SER EXCLUÍDO
  {
    username: 'dev',
    password: 'D',
    name: 'Dev',
    email: 'dev@cdforge.dev',
    role: 'admin',
    type: 'dev'
  }
]

// Função para obter funcionários predefinidos
export function getPredefinedEmployees(): DevUserConfig[] {
  return PREDEFINED_EMPLOYEES
}

// Função para obter usuários autorizados (apenas DEV)
export function getAuthorizedUsers(): DevUserConfig[] {
  return DEV_USERS
}

// Função para obter apenas usuários DEV
export function getDevUsers(): DevUserConfig[] {
  return PREDEFINED_EMPLOYEES.filter(user => user.type === 'dev')
}

// Função para obter apenas funcionários
export function getFuncionarios(): DevUserConfig[] {
  return PREDEFINED_EMPLOYEES.filter(user => user.type === 'funcionario')
}

// Função para validar credenciais
export function validateCredentials(username: string, password: string): DevUserConfig | null {
  // Validar com funcionários predefinidos
  const predefinedUser = PREDEFINED_EMPLOYEES.find(
    user => user.username === username && user.password === password
  )
  
  if (predefinedUser) {
    return predefinedUser
  }

  return null
}

// Função para obter usuário por username
export function getUserByUsername(username: string): DevUserConfig | null {
  // Primeiro buscar nos funcionários predefinidos
  const predefinedUser = PREDEFINED_EMPLOYEES.find(user => user.username === username)
  if (predefinedUser) {
    return predefinedUser
  }
  
  // Fallback para usuários DEV
  return DEV_USERS.find(user => user.username === username) || null
}

// Função para verificar se usuário é DEV
export function isDevUser(username: string): boolean {
  const user = getUserByUsername(username)
  return user?.type === 'dev'
}

// Função para verificar se usuário tem acesso à área DEV
export function hasDevAccess(username: string): boolean {
  return username === 'dev'
}

// Função para verificar se usuário é funcionário
export function isFuncionario(username: string): boolean {
  const user = getUserByUsername(username)
  return user?.type === 'funcionario'
}

// Configurações de segurança
export const SECURITY_CONFIG = {
  sessionDuration: parseInt(process.env.DEV_SESSION_DURATION || '86400000'), // 24 horas
  maxLoginAttempts: parseInt(process.env.DEV_MAX_LOGIN_ATTEMPTS || '5'),
  lockoutDuration: parseInt(process.env.DEV_LOCKOUT_DURATION || '300000'), // 5 minutos
}

// Função de debug para testar login
export function debugLogin(username: string, password: string): void {
  console.log('🔍 DEBUG LOGIN:')
  console.log('Username:', username)
  console.log('Password:', password)
  
  console.log('📋 Todos os funcionários predefinidos:', PREDEFINED_EMPLOYEES.map(u => ({ username: u.username, type: u.type })))
  
  const predefinedUser = PREDEFINED_EMPLOYEES.find(
    user => user.username === username && user.password === password
  )
  
  console.log('Predefined user found:', predefinedUser)
  
  const devUser = DEV_USERS.find(
    user => user.username === username && user.password === password
  )
  
  console.log('Dev user found:', devUser)
  
  const result = validateCredentials(username, password)
  console.log('Final result:', result)
  
  if (result) {
    console.log('🔍 Testando funções de tipo:')
    console.log('isDevUser:', isDevUser(username))
    console.log('isFuncionario:', isFuncionario(username))
  }
}
