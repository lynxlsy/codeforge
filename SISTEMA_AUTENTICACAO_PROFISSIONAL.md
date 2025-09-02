# Sistema de Autenticação Profissional - Como as Grandes Empresas Fazem

## 🎯 O Problema Atual

### ❌ **Como está agora (não profissional):**
```typescript
// lib/dev-auth-config.ts
const DEV_USERS: DevUserConfig[] = [
  {
    username: 'Mllk',
    password: 'M7', // ❌ Senha no código!
    name: 'Mllk Developer',
    email: 'mllk@cdforge.dev',
    role: 'admin',
    type: 'dev'
  }
]
```

### ✅ **Como deveria ser (profissional):**
```typescript
// Apenas configuração, sem dados
const AUTH_CONFIG = {
  jwtSecret: process.env.JWT_SECRET,
  sessionDuration: 24 * 60 * 60 * 1000, // 24 horas
  bcryptRounds: 12
}
```

## 🏢 Arquitetura Profissional

### 1. **Banco de Dados Dedicado**

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Tabela de sessões
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. **API de Autenticação**

```typescript
// api/auth/login.ts
export async function POST(request: Request) {
  const { username, password } = await request.json()
  
  // 1. Buscar usuário no banco
  const user = await db.users.findUnique({
    where: { username, is_active: true }
  })
  
  if (!user) {
    return Response.json({ error: 'Usuário não encontrado' }, { status: 401 })
  }
  
  // 2. Verificar senha
  const isValid = await bcrypt.compare(password, user.password_hash)
  
  if (!isValid) {
    return Response.json({ error: 'Senha incorreta' }, { status: 401 })
  }
  
  // 3. Gerar JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
  
  // 4. Salvar sessão
  await db.sessions.create({
    data: {
      user_id: user.id,
      token_hash: await bcrypt.hash(token, 10),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  })
  
  // 5. Atualizar último login
  await db.users.update({
    where: { id: user.id },
    data: { last_login: new Date() }
  })
  
  return Response.json({ token, user: { id: user.id, username: user.username, role: user.role } })
}
```

### 3. **Middleware de Autenticação**

```typescript
// middleware/auth.ts
export async function authMiddleware(request: Request) {
  const token = request.headers.get('Authorization')?.replace('Bearer ', '')
  
  if (!token) {
    return Response.json({ error: 'Token não fornecido' }, { status: 401 })
  }
  
  try {
    // Verificar JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any
    
    // Verificar se sessão ainda existe
    const session = await db.sessions.findFirst({
      where: {
        user_id: decoded.userId,
        expires_at: { gt: new Date() }
      }
    })
    
    if (!session) {
      return Response.json({ error: 'Sessão expirada' }, { status: 401 })
    }
    
    // Buscar dados do usuário
    const user = await db.users.findUnique({
      where: { id: decoded.userId }
    })
    
    if (!user || !user.is_active) {
      return Response.json({ error: 'Usuário inativo' }, { status: 401 })
    }
    
    // Adicionar usuário ao request
    request.user = user
    return NextResponse.next()
    
  } catch (error) {
    return Response.json({ error: 'Token inválido' }, { status: 401 })
  }
}
```

## 🔐 Segurança Profissional

### 1. **Hash de Senhas**
```typescript
// Senhas NUNCA em texto plano
const passwordHash = await bcrypt.hash(password, 12)
```

### 2. **JWT com Expiração**
```typescript
const token = jwt.sign(payload, secret, { expiresIn: '24h' })
```

### 3. **Rate Limiting**
```typescript
// Limitar tentativas de login
const attempts = await redis.get(`login_attempts:${ip}`)
if (attempts > 5) {
  return Response.json({ error: 'Muitas tentativas' }, { status: 429 })
}
```

### 4. **Logs de Auditoria**
```typescript
// Registrar todas as ações
await db.audit_logs.create({
  data: {
    user_id: user.id,
    action: 'LOGIN',
    ip_address: request.ip,
    user_agent: request.headers.get('User-Agent')
  }
})
```

## 🚀 Migração do Sistema Atual

### **Fase 1: Preparação**
1. Configurar banco de dados (PostgreSQL/MySQL)
2. Criar tabelas de usuários e sessões
3. Implementar API de autenticação

### **Fase 2: Migração de Dados**
```typescript
// Script de migração
const usersToMigrate = [
  { username: 'Mllk', email: 'mllk@cdforge.dev', role: 'admin' }
]

for (const user of usersToMigrate) {
  await db.users.create({
    data: {
      username: user.username,
      email: user.email,
      password_hash: await bcrypt.hash('senha_temporaria', 12),
      role: user.role,
      is_active: true
    }
  })
}
```

### **Fase 3: Atualização do Frontend**
```typescript
// hooks/use-auth.ts
export function useAuth() {
  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    
    if (response.ok) {
      const { token, user } = await response.json()
      localStorage.setItem('token', token)
      setUser(user)
    }
  }
}
```

## 📊 Benefícios da Migração

### **Segurança**
- ✅ Senhas hasheadas
- ✅ Tokens JWT seguros
- ✅ Rate limiting
- ✅ Logs de auditoria

### **Escalabilidade**
- ✅ Milhares de usuários
- ✅ Sem necessidade de deploy para mudanças
- ✅ Sistema distribuído

### **Manutenibilidade**
- ✅ Código limpo
- ✅ Separação de responsabilidades
- ✅ Fácil de testar

## 🎯 Próximos Passos para CDforge

1. **Implementar banco de dados** (PostgreSQL recomendado)
2. **Criar API de autenticação** com JWT
3. **Migrar usuários existentes**
4. **Atualizar frontend** para usar nova API
5. **Remover dados hardcoded** do código

---

**Esta é a forma como as grandes empresas realmente fazem! 🏢✨**



