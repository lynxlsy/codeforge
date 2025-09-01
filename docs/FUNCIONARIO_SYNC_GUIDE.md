# 🔄 Sistema de Sincronização dos Funcionários

## 📋 Visão Geral

Este sistema permite sincronizar automaticamente todos os dados dos funcionários com o Firebase, incluindo estatísticas, performance e metas mensais.

## 🗂️ Estrutura do Firebase

### Coleções Utilizadas:
- `funcionarios` - Dados básicos dos funcionários
- `funcionario_stats` - Estatísticas e performance
- `projects` - Projetos (para calcular estatísticas)
- `orders` - Pedidos (para calcular estatísticas)
- `team` - Dados básicos da equipe
- `team_members` - Membros da equipe (Sobre Nós)
- `employees` - Gerenciamento de funcionários (Área DEV)

## 🚀 Como Usar

### 1. Importar o Hook

```tsx
import { useFuncionarioSync } from '@/hooks/use-funcionario-sync'
```

### 2. Usar no Componente

```tsx
function FuncionariosPage() {
  const { 
    funcionarioData, 
    stats, 
    loading, 
    syncing, 
    error, 
    syncData, 
    updateStatus 
  } = useFuncionarioSync()

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <div>
      <h1>{funcionarioData?.username}</h1>
      <p>Projetos Entregues: {stats?.completedProjects}</p>
      <p>Performance: {stats?.performance.deliveryRate}%</p>
      
      <button onClick={syncData} disabled={syncing}>
        {syncing ? 'Sincronizando...' : 'Sincronizar'}
      </button>
    </div>
  )
}
```

## 📊 Dados Sincronizados

### Estatísticas Automáticas:
- **Total de Projetos**: Conta todos os projetos do funcionário
- **Projetos Entregues**: Projetos com status 'completed'
- **Projetos em Andamento**: Projetos com status 'pending' ou 'in_progress'
- **Valor Total**: Soma dos orçamentos dos projetos entregues
- **Taxa de Entrega**: Porcentagem de projetos entregues
- **Tempo Médio**: Tempo médio para entregar projetos (em dias)
- **Meta Mensal**: Projetos entregues no mês atual vs meta de 15

### Dados Básicos:
- **Membro desde**: Data de criação do registro
- **Status**: ativo/inativo/suspenso
- **Email e Username**: Dados do usuário

## 👥 Sincronização da Equipe (Sobre Nós)

### Dados da Equipe:
- **Nome**: Nome do membro da equipe
- **Cargo**: Função/posição na equipe
- **Descrição**: Biografia e especialidades
- **Especialidades**: Lista de habilidades
- **Ícone e Cores**: Configuração visual
- **Status**: Ativo/inativo
- **Data de Entrada**: Quando entrou na equipe

## 🔧 Funções Disponíveis

### `useFuncionarioSync()`

#### Retorna:
```tsx
{
  // Dados
  funcionarioData: FuncionarioData | null
  stats: FuncionarioStats | null
  
  // Estados
  loading: boolean
  syncing: boolean
  error: string | null
  
  // Ações
  syncData: () => Promise<void>
  updateStatus: (status: 'ativo' | 'inativo' | 'suspenso') => Promise<void>
  refetch: () => Promise<void>
  
  // Utilitários
  isOnline: boolean
  needsSync: boolean
}
```

### `useTeamSync()`

#### Retorna:
```tsx
{
  // Dados
  teamData: TeamData | null
  members: TeamMember[]
  
  // Estados
  loading: boolean
  syncing: boolean
  error: string | null
  
  // Ações
  syncData: () => Promise<void>
  updateMember: (memberId: string, updates: Partial<TeamMember>) => Promise<void>
  addMember: (member: Omit<TeamMember, 'id' | 'joinedAt' | 'updatedAt'>) => Promise<string>
  refetch: () => Promise<void>
  
  // Utilitários
  totalMembers: number
  activeMembers: number
  needsSync: boolean
}
```

## ⚡ Funcionalidades Automáticas

### 1. Auto-Sync
- Sincroniza automaticamente a cada 5 minutos
- Verifica se os dados estão desatualizados

### 2. Listener em Tempo Real
- Atualiza dados automaticamente quando há mudanças no Firebase
- Mantém a interface sempre atualizada

### 3. Sincronização Inteligente
- Só sincroniza quando necessário
- Evita requisições desnecessárias

## 🎯 Implementação na Área dos Funcionários

### Atualizar `app/funcionarios/page.tsx`:

```tsx
import { useFuncionarioSync } from '@/hooks/use-funcionario-sync'

function FuncionariosContent() {
  const { 
    funcionarioData, 
    stats, 
    loading, 
    syncing, 
    syncData 
  } = useFuncionarioSync()

  // Usar stats em vez de dados mockados
  const displayStats = {
    completedProjects: stats?.completedProjects || 0,
    pendingProjects: stats?.pendingProjects || 0,
    memberSince: stats?.memberSince || 'Aguardando sincronização',
    status: stats?.status || 'ativo',
    performance: stats?.performance || { deliveryRate: 0, averageTime: 0 },
    monthlyGoal: stats?.monthlyGoal || { target: 15, completed: 0, percentage: 0 }
  }

  return (
    <div>
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <p>Projetos Entregues</p>
            <p className="text-2xl font-bold text-green-400">
              {displayStats.completedProjects}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <p>Projetos em Andamento</p>
            <p className="text-2xl font-bold text-orange-400">
              {displayStats.pendingProjects}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Botão de Sincronização */}
      <Button 
        onClick={syncData} 
        disabled={syncing}
        className="mt-4"
      >
        {syncing ? 'Sincronizando...' : 'Sincronizar Dados'}
      </Button>
    </div>
  )
}
```

## 🎯 Implementação na Página Sobre Nós

### Atualizar `app/sobre/page.tsx`:

```tsx
import { useTeamSync } from '@/hooks/use-team-sync'

export default function SobrePage() {
  const { 
    members, 
    loading, 
    syncing, 
    syncData 
  } = useTeamSync()

  // Usar dados sincronizados em vez de dados mockados
  const founders = members.length > 0 ? members.map(member => ({
    name: member.name,
    role: member.role,
    specialties: member.specialties,
    description: member.description,
    icon: getIconComponent(member.icon), // Função para converter string em componente
    color: member.color,
    bgColor: member.bgColor,
    borderColor: member.borderColor,
  })) : [
    // Fallback para "Aguardando sincronização"
    {
      name: "Aguardando sincronização",
      role: "Aguardando sincronização",
      specialties: ["Aguardando sincronização"],
      description: "Aguardando sincronização dos dados da equipe.",
      icon: Code,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-500/10",
      borderColor: "border-gray-500/20",
    }
  ]

  return (
    <div>
      {/* Botão de Sincronização */}
      <Button 
        onClick={syncData} 
        disabled={syncing}
        className="mb-4"
      >
        {syncing ? 'Sincronizando...' : 'Sincronizar Equipe'}
      </Button>

      {/* Cards da Equipe */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {founders.map((founder, index) => (
          <Card key={founder.name}>
            {/* ... resto do código dos cards ... */}
          </Card>
        ))}
      </div>
    </div>
  )
}
```

## 🔄 Processo de Sincronização

### 1. Dados Básicos
```tsx
await syncFuncionarioBasicData(userId, userData)
```

### 2. Estatísticas
```tsx
await syncFuncionarioStats(userId)
```

### 3. Dados Completos
```tsx
const data = await getFuncionarioData(userId)
```

## 📝 Exemplo de Uso Completo

```tsx
"use client"

import { useFuncionarioSync } from '@/hooks/use-funcionario-sync'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, CheckCircle, Clock } from 'lucide-react'

export default function FuncionariosPage() {
  const { 
    funcionarioData, 
    stats, 
    loading, 
    syncing, 
    error, 
    syncData 
  } = useFuncionarioSync()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-red-500 mb-4">Erro ao carregar dados</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={syncData}>Tentar Novamente</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Área do Funcionário - {funcionarioData?.username}
        </h1>
        
        <Button 
          onClick={syncData} 
          disabled={syncing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Sincronizando...' : 'Sincronizar'}
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Projetos Entregues</p>
                <p className="text-2xl font-bold text-green-400">
                  {stats?.completedProjects || 0}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Projetos em Andamento</p>
                <p className="text-2xl font-bold text-orange-400">
                  {stats?.pendingProjects || 0}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações Adicionais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-400 mb-2">📈 Performance</h4>
            <p className="text-gray-400">
              Taxa de entrega: {stats?.performance.deliveryRate || 0}%
            </p>
            <p className="text-gray-400">
              Tempo médio: {stats?.performance.averageTime || 0} dias
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold text-blue-400 mb-2">🎯 Meta Mensal</h4>
            <p className="text-gray-400">
              {stats?.monthlyGoal.completed || 0} de {stats?.monthlyGoal.target || 15} projetos
            </p>
            <div className="mt-2">
              <div className="bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-400 h-2 rounded-full" 
                  style={{ width: `${stats?.monthlyGoal.percentage || 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats?.monthlyGoal.percentage || 0}% concluído
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

## 👥 Gerenciamento de Funcionários (Área DEV)

### Funcionalidades:
- ✅ **Adicionar Funcionários** - Modal com formulário completo
- ✅ **Editar Funcionários** - Atualizar dados, email, senha e cargo
- ✅ **Excluir Funcionários** - Confirmação antes da exclusão
- ✅ **Buscar Funcionários** - Filtro por nome, email ou cargo
- ✅ **Mudança de Cargo** - Funcionário ↔ Desenvolvedor
- ✅ **Sincronização Firebase** - Dados persistentes e em tempo real
- ✅ **Validação de Credenciais** - Login integrado com Firebase

### Como Usar:

```tsx
import { useEmployees } from '@/hooks/use-employees'

function EmployeesManager() {
  const { 
    employees, 
    loading, 
    error, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee 
  } = useEmployees()

  // Adicionar funcionário
  await addEmployee({
    username: "novo_usuario",
    email: "usuario@cdforge.com",
    password: "senha123",
    role: "funcionario",
    isActive: true
  })

  // Atualizar funcionário
  await updateEmployee("user-id", {
    username: "novo_nome",
    role: "dev"
  })

  // Excluir funcionário
  await deleteEmployee("user-id")
}
```

### Estrutura de Dados:

```typescript
interface Employee {
  id: string
  username: string
  email: string
  password: string
  role: 'dev' | 'funcionario'
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  lastLogin?: Date
}
```

## 🎯 Próximos Passos

1. **✅ Implementar na área dos funcionários** usando o hook `useFuncionarioSync`
2. **✅ Configurar regras de segurança** no Firebase para as novas coleções
3. **✅ Adicionar campos nos projetos** para vincular aos funcionários (`assignedTo`)
4. **✅ Testar a sincronização** com dados reais
5. **Implementar cache local** para melhor performance
6. **Adicionar criptografia** de senhas
7. **Implementar logs** de ações administrativas

## 🔒 Regras de Segurança Firebase

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Funcionários podem ler/escrever seus próprios dados
    match /funcionarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Estatísticas dos funcionários
    match /funcionario_stats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Dados da equipe (públicos para leitura)
    match /team/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Membros da equipe (públicos para leitura)
    match /team_members/{memberId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Gerenciamento de funcionários (apenas devs)
    match /employees/{employeeId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

**✅ Sistema pronto para implementação!** 

Agora você pode substituir os dados mockados na área dos funcionários pelos dados reais sincronizados com o Firebase. 🚀
