# Sistema de Funcionários Predefinidos

## 🎯 **Visão Geral**

O sistema agora usa **funcionários predefinidos** em vez de criação dinâmica. Todos os funcionários são definidos no código e sincronizados com o Firebase para gerenciar status online e mudanças de cargo.

## 👥 **Funcionários Predefinidos**

### **Desenvolvedores (Dev)**
- **dev** / **D** - Dev (🔒 JAMAIS pode ser excluído)

### **Funcionários**
- **melke** / **M7** - Melke
- **ysun** / **122345** - Ysun
- **pedro** / **Alice** - Pedro
- **zanesco** / **HaxSHW02** - Zanesco

## 🔧 **Funcionalidades**

### ✅ **Mudança de Cargo**
- Altere o cargo de qualquer funcionário diretamente na interface
- Cargos disponíveis: `admin`, `dev`, `funcionario`, `viewer`
- Mudanças são salvas automaticamente no Firebase

### ✅ **Status Online**
- Funcionários ficam automaticamente online ao fazer login
- Status offline automático ao sair do sistema
- Visualização em tempo real de quem está online

### 🔒 **Proteção do Usuário Dev**
- O usuário **dev** JAMAIS pode ser modificado ou excluído
- Badge "🔒 Protegido" na interface
- Erro ao tentar alterar cargo do Dev

### ✅ **Sincronização Firebase**
- Botão "🔄 Sincronizar" para sincronizar funcionários
- Dados são salvos na coleção `predefined_employees`
- Status online na coleção `online_users`

## 🚀 **Como Usar**

### **1. Acessar Sistema**
```
URL: /dev
Login: dev / D
```

### **2. Gerenciar Funcionários**
- Vá para "Gerenciar Funcionários"
- Veja lista de funcionários predefinidos
- Use o dropdown para mudar cargos
- Veja status online em tempo real

### **3. Sincronizar Dados**
- Clique em "🔄 Sincronizar" para sincronizar com Firebase
- Funcionários são criados/atualizados automaticamente

## 📊 **Interface**

### **Estatísticas**
- **Total**: Número total de funcionários
- **Online**: Funcionários atualmente conectados
- **Desenvolvedores**: Quantidade de devs
- **Funcionários**: Quantidade de funcionários

### **Lista de Funcionários**
- Nome e informações básicas
- Badges de cargo e tipo
- Status online (🟢 Online)
- Último login
- Dropdown para mudar cargo

### **Funcionários Online**
- Seção separada mostrando quem está online
- Atualização em tempo real

## 🔐 **Sistema de Autenticação**

### **Login**
- Validação com funcionários predefinidos
- Criação automática no Firebase se não existir
- Marcação automática como online

### **Logout**
- Marcação automática como offline
- Limpeza de sessão
- Atualização em tempo real

## 🗂️ **Estrutura Firebase**

### **Coleção: `predefined_employees`**
```json
{
  "username": "dev",
  "name": "Dev",
  "email": "dev@cdforge.dev",
  "role": "admin",
  "type": "dev",
  "isActive": true,
  "lastLogin": "2024-01-01T10:00:00Z",
  "onlineStatus": "online",
  "lastActivity": "2024-01-01T10:00:00Z"
}
```

### **Coleção: `online_users`**
```json
{
  "username": "dev",
  "status": "online",
  "lastActivity": "2024-01-01T10:00:00Z",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

## 🎨 **Vantagens do Sistema**

### ✅ **Simplicidade**
- Não precisa criar funcionários manualmente
- Sistema predefinido e estável

### ✅ **Controle**
- Mudança de cargos fácil
- Status online em tempo real

### ✅ **Confiabilidade**
- Dados sincronizados com Firebase
- Backup automático

### ✅ **Performance**
- Carregamento rápido
- Interface responsiva

## 🔧 **Manutenção**

### **Adicionar Novo Funcionário**
1. Editar `lib/dev-auth-config.ts`
2. Adicionar na array `PREDEFINED_EMPLOYEES`
3. Sincronizar no Firebase

### **Mudar Cargo**
1. Acessar interface de funcionários
2. Usar dropdown para mudar cargo
3. Mudança salva automaticamente

### **Verificar Status**
1. Usar botão "🔄 Recarregar"
2. Ver seção "Funcionários Online"
3. Verificar logs no console

## 🎯 **Próximos Passos**

- [ ] Adicionar mais funcionários predefinidos
- [ ] Implementar histórico de mudanças de cargo
- [ ] Adicionar notificações de status online
- [ ] Melhorar interface mobile

---

**Sistema funcionando perfeitamente! 🚀**
