# 🔥 Regras de Segurança do Firebase

## ⚠️ IMPORTANTE: Configure estas regras no Firebase Console

Para resolver o erro "acesso negado", você precisa configurar as regras de segurança do Firestore no Firebase Console.

### 📍 Como acessar:
1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto `cdforge`
3. No menu lateral, clique em **"Firestore Database"**
4. Clique na aba **"Rules"**
5. Substitua as regras existentes pelas regras abaixo

### 🔐 Regras de Segurança Recomendadas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ============================================================================
    // COLETAS PÚBLICAS (leitura pública, escrita autenticada)
    // ============================================================================
    
    // Projetos - leitura pública, escrita autenticada
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Pedidos - leitura pública, escrita autenticada
    match /orders/{orderId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // ============================================================================
    // COLETAS DE FUNCIONÁRIOS (acesso autenticado)
    // ============================================================================
    
    // Funcionários - leitura/escrita autenticada
    match /employees/{employeeId} {
      allow read, write: if request.auth != null;
    }
    
    // Dados de funcionários - leitura/escrita autenticada
    match /funcionarios/{funcionarioId} {
      allow read, write: if request.auth != null;
    }
    
    // Estatísticas de funcionários - leitura/escrita autenticada
    match /funcionario_stats/{statsId} {
      allow read, write: if request.auth != null;
    }
    
    // Usuários DEV - leitura/escrita autenticada
    match /dev-users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // ============================================================================
    // COLETAS DE EQUIPE (leitura pública, escrita autenticada)
    // ============================================================================
    
    // Dados da equipe - leitura pública, escrita autenticada
    match /team/{teamId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Membros da equipe - leitura pública, escrita autenticada
    match /team_members/{memberId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // ============================================================================
    // COLETAS DE STATUS ONLINE (acesso autenticado)
    // ============================================================================
    
    // Usuários online - leitura/escrita autenticada
    match /online_users/{userId} {
      allow read, write: if request.auth != null;
    }
    
    // ============================================================================
    // COLETAS DE SESSÕES (acesso autenticado)
    // ============================================================================
    
    // Sessões de usuário - leitura/escrita autenticada
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
    
    // ============================================================================
    // REGRA PADRÃO - Negar tudo que não foi explicitamente permitido
    // ============================================================================
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 🚀 Regras Temporárias (Para Teste):

Se você quiser testar rapidamente, pode usar estas regras mais permissivas (⚠️ **APENAS PARA DESENVOLVIMENTO**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 📋 Passos para Configurar:

1. **Copie as regras** acima
2. **Cole no Firebase Console** na aba Rules
3. **Clique em "Publish"**
4. **Aguarde alguns segundos** para as regras serem aplicadas
5. **Teste novamente** a criação de funcionários

### 🔍 Verificação:

Após configurar as regras, você deve ver no console:
- ✅ `🔄 Iniciando adição de funcionário:`
- ✅ `🔄 ID gerado:`
- ✅ `🔄 Dados do funcionário preparados:`
- ✅ `🔄 Tentando salvar na coleção: employees`
- ✅ `✅ Funcionário salvo com sucesso no Firebase`

### ⚡ Se ainda houver problemas:

1. **Verifique se o projeto está correto** no `lib/firebase.ts`
2. **Aguarde 1-2 minutos** após publicar as regras
3. **Limpe o cache do navegador** (Ctrl+F5)
4. **Verifique se há erros de rede** no console

### 🎯 Resultado Esperado:

Com as regras configuradas corretamente, você poderá:
- ✅ Criar funcionários na área DEV
- ✅ Fazer login com funcionários criados
- ✅ Acessar a área de funcionários
- ✅ Ver os dados sincronizados no Firebase

**Configure as regras agora e teste novamente!** 🔥







