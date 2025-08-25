# 🔐 Segurança das Credenciais DEV

## ⚠️ IMPORTANTE - CONFIGURAÇÃO DE SEGURANÇA

### 📁 Arquivo de Configuração
As credenciais dos usuários DEV estão centralizadas no arquivo:
```
lib/dev-auth-config.ts
```

### 🔒 Como Configurar Variáveis de Ambiente

1. **Crie um arquivo `.env.local` na raiz do projeto:**
```bash
# Configurações de Autenticação DEV
DEV_USER_1=mllk=mllk
DEV_USER_2=lynx=lynx
DEV_USER_3=cd4=cd4

# Configurações de Segurança
DEV_SESSION_DURATION=86400000
DEV_MAX_LOGIN_ATTEMPTS=5
DEV_LOCKOUT_DURATION=300000
```

2. **O sistema irá usar as variáveis de ambiente se disponíveis, senão usa os valores padrão**

### 🛡️ Medidas de Segurança Implementadas

#### ✅ **Credenciais Centralizadas**
- Todas as credenciais em um único arquivo
- Fácil de gerenciar e atualizar
- Suporte a variáveis de ambiente

#### ✅ **Validação Dupla**
- Verificação local das credenciais
- Validação no Firebase para sessões
- Logs de auditoria

#### ✅ **Proteção de Rota**
- Middleware de proteção
- Verificação em tempo real
- Redirecionamento automático

#### ✅ **Sessões Seguras**
- Sessões com expiração automática
- Validação periódica
- Limpeza automática de sessões expiradas

### 🚨 **Recomendações de Segurança**

#### 🔴 **NUNCA FAÇA:**
- Commitar credenciais no git
- Usar senhas fracas
- Compartilhar credenciais por email/chat
- Deixar credenciais em logs

#### 🟢 **SEMPRE FAÇA:**
- Use variáveis de ambiente em produção
- Troque senhas regularmente
- Monitore logs de acesso
- Use HTTPS em produção

### 🔧 **Como Alterar Credenciais**

1. **Edite o arquivo `lib/dev-auth-config.ts`**
2. **Ou configure variáveis de ambiente**
3. **Reinicie o servidor**
4. **Teste o login com novas credenciais**

### 📊 **Usuários Padrão**

| Usuário | Senha | Role | Descrição |
|---------|-------|------|-----------|
| mllk | mllk | admin | Administrador principal |
| lynx | lynx | dev | Desenvolvedor |
| cd4 | cd4 | dev | Desenvolvedor |

### 🔍 **Logs de Auditoria**

O sistema registra:
- Tentativas de login (sucesso/falha)
- Criação de sessões
- Validação de sessões
- Logouts

### 🚀 **Para Produção**

1. **Configure variáveis de ambiente**
2. **Use senhas fortes**
3. **Implemente rate limiting**
4. **Adicione autenticação 2FA**
5. **Monitore logs de acesso**
6. **Configure alertas de segurança**

---

**⚠️ LEMBRE-SE: A segurança é responsabilidade de todos!**
