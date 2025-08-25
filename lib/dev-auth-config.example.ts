// EXEMPLO de configuração de usuários DEV autorizados
// ⚠️ COPIE este arquivo para dev-auth-config.ts e configure suas credenciais
// ⚠️ NUNCA commite o arquivo dev-auth-config.ts com credenciais reais

interface DevUserConfig {
  username: string
  password: string
  name: string
  email: string
  role: 'admin' | 'dev' | 'viewer'
}

// Lista de usuários autorizados (EXEMPLO)
// ⚠️ IMPORTANTE: Altere estas credenciais para suas próprias
const DEV_USERS: DevUserConfig[] = [
  {
    username: process.env.DEV_USER_1?.split('=')[0] || 'admin',
    password: process.env.DEV_USER_1?.split('=')[1] || 'senha123',
    name: 'Administrador',
    email: 'admin@exemplo.com',
    role: 'admin'
  },
  {
    username: process.env.DEV_USER_2?.split('=')[0] || 'dev1',
    password: process.env.DEV_USER_2?.split('=')[1] || 'senha456',
    name: 'Desenvolvedor 1',
    email: 'dev1@exemplo.com',
    role: 'dev'
  },
  {
    username: process.env.DEV_USER_3?.split('=')[0] || 'dev2',
    password: process.env.DEV_USER_3?.split('=')[1] || 'senha789',
    name: 'Desenvolvedor 2',
    email: 'dev2@exemplo.com',
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

/*
INSTRUÇÕES DE CONFIGURAÇÃO:

1. Copie este arquivo para dev-auth-config.ts
2. Altere as credenciais para suas próprias
3. Configure variáveis de ambiente se necessário
4. Nunca commite credenciais reais no git

EXEMPLO DE VARIÁVEIS DE AMBIENTE (.env.local):
DEV_USER_1=meuusuario=minhasenha123
DEV_USER_2=outrousuario=outrasenha456
DEV_USER_3=terceirousuario=terceirasenha789
*/
