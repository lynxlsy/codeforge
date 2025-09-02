# 🔥 Exemplo de Integração Firebase

Este arquivo mostra como integrar os hooks do Firebase nos componentes existentes.

## 📝 Exemplo: Integrando useProjects no ProjectsManager

### Antes (Dados Mockados)
```typescript
// components/dev/projects-manager.tsx
const [projects, setProjects] = useState<Project[]>(mockProjects)
```

### Depois (Com Firebase)
```typescript
// components/dev/projects-manager.tsx
import { useProjects } from '@/hooks/use-firebase'

export function ProjectsManager() {
  const { 
    projects, 
    loading, 
    error, 
    createProject, 
    updateProject, 
    deleteProject 
  } = useProjects()

  // Agora os dados vêm do Firebase automaticamente
  // loading e error são gerenciados pelo hook
  
  const handleCreateProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createProject(projectData)
      // Toast de sucesso
    } catch (error) {
      // Toast de erro
    }
  }

  const handleUpdateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await updateProject(id, updates)
      // Toast de sucesso
    } catch (error) {
      // Toast de erro
    }
  }

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id)
      // Toast de sucesso
    } catch (error) {
      // Toast de erro
    }
  }

  if (loading) {
    return <div>Carregando projetos...</div>
  }

  if (error) {
    return <div>Erro: {error}</div>
  }

  return (
    // Seu JSX aqui
  )
}
```

## 📝 Exemplo: Integrando usePromotions no PromotionsManager

```typescript
// components/dev/promotions-manager.tsx
import { usePromotions } from '@/hooks/use-firebase'

export function PromotionsManager() {
  const { 
    promotions, 
    loading, 
    error, 
    createPromotion, 
    updatePromotion, 
    deletePromotion 
  } = usePromotions()

  const handleCreatePromotion = async (promotionData: Omit<Promotion, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      await createPromotion(promotionData)
      toast({
        title: "Promoção criada!",
        description: "A nova promoção foi criada com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível criar a promoção.",
        variant: "destructive",
      })
    }
  }

  const handleTogglePromotion = async (id: string, isActive: boolean) => {
    try {
      await updatePromotion(id, { active: isActive })
      toast({
        title: "Status atualizado!",
        description: `Promoção ${isActive ? 'ativada' : 'desativada'} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível atualizar o status da promoção.",
        variant: "destructive",
      })
    }
  }

  // ... resto do componente
}
```

## 📝 Exemplo: Integrando useContacts no ContactManager

```typescript
// components/dev/contact-manager.tsx
import { useContacts } from '@/hooks/use-firebase'

export function ContactManager() {
  const { 
    contacts, 
    loading, 
    error, 
    createContact, 
    updateContact, 
    deleteContact 
  } = useContacts()

  const handleCreateContact = async (contactData: Omit<ContactMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createContact(contactData)
      toast({
        title: "Contato criado!",
        description: "O novo método de contato foi criado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível criar o contato.",
        variant: "destructive",
      })
    }
  }

  // ... resto do componente
}
```

## 📝 Exemplo: Integrando usePricing no PricingManager

```typescript
// components/dev/pricing-manager.tsx
import { usePricing } from '@/hooks/use-firebase'

export function PricingManager() {
  const { 
    config, 
    servicePlans, 
    loading, 
    error, 
    updateConfig, 
    createServicePlan,
    updateServicePlan,
    deleteServicePlan
  } = usePricing()

  const handleUpdatePricing = async (newConfig: PricingConfig) => {
    try {
      await updateConfig(newConfig)
      toast({
        title: "Preços atualizados!",
        description: "As configurações de preço foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Não foi possível atualizar os preços.",
        variant: "destructive",
      })
    }
  }

  // ... resto do componente
}
```

## 📝 Exemplo: Integrando useStats no DevDashboard

```typescript
// components/dev/dev-dashboard.tsx
import { useStats } from '@/hooks/use-firebase'

const OverviewSection = () => {
  const { stats, loading, error } = useStats()

  if (loading) {
    return <div>Carregando estatísticas...</div>
  }

  if (error) {
    return <div>Erro ao carregar estatísticas: {error}</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Pedidos Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-400 mb-1">
            {stats?.pendingProjects || 0}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <CheckCircle className="h-3 w-3 text-orange-400 mr-1" />
            Dados em tempo real
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Pedidos Aprovados</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400 mb-1">
            {stats?.approvedProjects || 0}
          </div>
          <div className="flex items-center text-xs text-gray-400">
            <CheckCircle className="h-3 w-3 text-green-400 mr-1" />
            Dados em tempo real
          </div>
        </CardContent>
      </Card>

      {/* ... outros cards */}
    </div>
  )
}
```

## 🔄 Estados de Loading e Error

Todos os hooks gerenciam automaticamente os estados de loading e error:

```typescript
const { 
  data, 
  loading, 
  error, 
  // ... métodos
} = useHook()

// Loading state
if (loading) {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      <span className="ml-2 text-gray-400">Carregando...</span>
    </div>
  )
}

// Error state
if (error) {
  return (
    <div className="flex items-center justify-center p-8">
      <AlertTriangle className="h-8 w-8 text-red-600" />
      <span className="ml-2 text-red-400">Erro: {error}</span>
    </div>
  )
}
```

## 🎯 Benefícios da Integração

1. **Dados em Tempo Real**: Os dados são carregados automaticamente do Firebase
2. **Estados Gerenciados**: Loading e error são gerenciados automaticamente
3. **CRUD Completo**: Operações de criar, ler, atualizar e deletar
4. **Sincronização**: Mudanças são refletidas automaticamente na interface
5. **Tratamento de Erros**: Erros são capturados e exibidos adequadamente
6. **Performance**: Dados são carregados apenas quando necessário

## 🚀 Próximos Passos

1. Configure as variáveis de ambiente do Firebase
2. Substitua os dados mockados pelos hooks do Firebase
3. Teste as operações CRUD
4. Configure as regras de segurança do Firestore
5. Implemente autenticação do Firebase (opcional)
















