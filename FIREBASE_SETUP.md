# 🔥 Configuração do Firebase - CDforge

Este guia explica como configurar o Firebase no projeto CDforge.

## 📋 Pré-requisitos

1. Conta no Google Firebase Console
2. Projeto Firebase criado
3. Firestore Database habilitado
4. Authentication habilitado (opcional)

## 🚀 Passo a Passo

### 1. Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: `cdforge-dev`)
4. Siga os passos de configuração

### 2. Habilitar Firestore Database

1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: `us-central1`)

### 3. Configurar Regras do Firestore

No Firestore Database > Regras, configure as regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todos (apenas para desenvolvimento)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Estas regras permitem acesso total. Para produção, configure regras mais restritivas.

### 4. Obter Credenciais do Projeto

1. No console do Firebase, vá para "Configurações do projeto" (ícone de engrenagem)
2. Clique em "Configurações do projeto"
3. Role para baixo até "Seus aplicativos"
4. Clique em "Adicionar app" > "Web"
5. Digite um nome para o app (ex: `cdforge-web`)
6. Copie as credenciais de configuração

### 5. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env.local` na raiz do projeto
2. Adicione as seguintes variáveis com suas credenciais:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_projeto_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_projeto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_projeto_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu_measurement_id
```

### 6. Estrutura do Firestore

O projeto está configurado para usar as seguintes coleções:

#### 📁 Coleções Principais

- **`projects`** - Projetos/pedidos dos clientes
- **`promotions`** - Códigos promocionais
- **`contacts`** - Métodos de contato
- **`servicePlans`** - Planos de serviço
- **`config`** - Configurações gerais (preços, etc.)

#### 📄 Documentos de Configuração

- **`config/pricing`** - Configurações de preços

### 7. Testar a Configuração

1. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse a área DEV: `http://localhost:3000/dev`

3. Faça login com as credenciais:
   - Email: `admin@cdforge.dev`
   - Senha: `cdforge2024`

4. Verifique se os dados estão sendo carregados do Firebase

## 🔧 Serviços Disponíveis

### Projetos
```typescript
import { projectsService } from '@/lib/firebase-services'

// Buscar todos os projetos
const projects = await projectsService.getAll()

// Criar novo projeto
const id = await projectsService.create(projectData)

// Atualizar projeto
await projectsService.update(id, updates)

// Deletar projeto
await projectsService.delete(id)
```

### Promoções
```typescript
import { promotionsService } from '@/lib/firebase-services'

// Buscar todas as promoções
const promotions = await promotionsService.getAll()

// Criar nova promoção
const id = await promotionsService.create(promotionData)
```

### Contatos
```typescript
import { contactsService } from '@/lib/firebase-services'

// Buscar todos os contatos
const contacts = await contactsService.getAll()

// Criar novo contato
const id = await contactsService.create(contactData)
```

### Configurações de Preço
```typescript
import { pricingService } from '@/lib/firebase-services'

// Buscar configuração
const config = await pricingService.getConfig()

// Atualizar configuração
await pricingService.updateConfig(newConfig)
```

## 🎣 Hooks Disponíveis

### useProjects
```typescript
import { useProjects } from '@/hooks/use-firebase'

const { projects, loading, error, createProject, updateProject, deleteProject } = useProjects()
```

### usePromotions
```typescript
import { usePromotions } from '@/hooks/use-firebase'

const { promotions, loading, error, createPromotion, updatePromotion, deletePromotion } = usePromotions()
```

### useContacts
```typescript
import { useContacts } from '@/hooks/use-firebase'

const { contacts, loading, error, createContact, updateContact, deleteContact } = useContacts()
```

### usePricing
```typescript
import { usePricing } from '@/hooks/use-firebase'

const { config, servicePlans, loading, error, updateConfig } = usePricing()
```

### useStats
```typescript
import { useStats } from '@/hooks/use-firebase'

const { stats, loading, error } = useStats()
```

## 🚨 Troubleshooting

### Erro: "Firebase App named '[DEFAULT]' already exists"
- Verifique se o Firebase está sendo inicializado apenas uma vez
- O arquivo `lib/firebase.ts` já está configurado corretamente

### Erro: "Missing or insufficient permissions"
- Verifique as regras do Firestore
- Para desenvolvimento, use as regras permissivas mostradas acima

### Erro: "Project not found"
- Verifique se o `projectId` está correto nas variáveis de ambiente
- Confirme se o projeto existe no Firebase Console

### Dados não aparecem
- Verifique se as coleções existem no Firestore
- Confirme se as regras permitem leitura
- Verifique o console do navegador para erros

## 🔒 Segurança para Produção

Para produção, configure regras mais restritivas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso apenas para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique o console do navegador
2. Verifique o console do Firebase
3. Confirme se todas as variáveis de ambiente estão configuradas
4. Teste com as regras permissivas primeiro


