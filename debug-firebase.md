# 🔍 Diagnóstico do Firebase - Passo a Passo

## 🚨 **PROBLEMA IDENTIFICADO: Acesso Negado**

Vamos diagnosticar e resolver o problema passo a passo.

---

## 📋 **PASSO 1: Verificar Configuração do Firebase**

### 1.1 Verifique o Projeto no Firebase Console
- Acesse: https://console.firebase.google.com
- **Confirme** que está no projeto `cdforge`
- Verifique se o projeto está **ativo** (não em modo de teste)

### 1.2 Verifique o Firestore Database
- No menu lateral, clique em **"Firestore Database"**
- Verifique se está **"Ativo"** (não em modo de teste)
- Se estiver em modo de teste, clique em **"Ativar"**

### 1.3 Verifique as Regras Atuais
- Clique na aba **"Rules"**
- **Copie e cole** estas regras EXATAS:

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

- Clique em **"Publish"**
- Aguarde a confirmação

---

## 📋 **PASSO 2: Teste Manual no Console**

### 2.1 Abra o Console do Navegador
- Pressione **F12**
- Vá para a aba **"Console"**
- **Cole e execute** este código:

```javascript
// Teste manual do Firebase
console.log('🧪 Teste manual iniciado...')

// Verificar se o Firebase está disponível
if (typeof window !== 'undefined' && window.firebase) {
  console.log('✅ Firebase disponível')
  
  const db = window.firebase.firestore()
  
  // Teste de escrita
  db.collection('teste-manual').add({
    timestamp: new Date(),
    message: 'Teste manual de escrita'
  })
  .then((docRef) => {
    console.log('✅ Escrita bem-sucedida! ID:', docRef.id)
  })
  .catch((error) => {
    console.log('❌ Erro na escrita:', error.code, error.message)
  })
  
} else {
  console.log('❌ Firebase não disponível')
}
```

### 2.2 Verifique o Resultado
- Se aparecer **"✅ Escrita bem-sucedida!"** = Firebase funcionando
- Se aparecer **"❌ Erro na escrita"** = Problema nas regras

---

## 📋 **PASSO 3: Verificar Erro Específico**

### 3.1 Teste a Criação de Funcionário
1. Vá para a área DEV (Mllk/M7)
2. Vá para "Funcionários"
3. Tente criar um funcionário
4. **Copie TODOS os logs** do console

### 3.2 Identifique o Erro
Procure por estas mensagens específicas:

**Se aparecer:**
```
❌ Erro detalhado ao adicionar funcionário: {code: "permission-denied"}
```
→ **Problema nas regras do Firebase**

**Se aparecer:**
```
❌ Erro detalhado ao adicionar funcionário: {code: "unavailable"}
```
→ **Firebase indisponível**

**Se aparecer:**
```
❌ Erro detalhado ao adicionar funcionário: {code: "not-found"}
```
→ **Projeto não encontrado**

---

## 📋 **PASSO 4: Soluções Específicas**

### 4.1 Se o erro for "permission-denied":
1. **Verifique as regras** no Firebase Console
2. **Use estas regras mais simples:**

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

3. **Publique as regras**
4. **Aguarde 5 minutos**
5. **Teste novamente**

### 4.2 Se o erro for "unavailable":
1. **Verifique sua conexão com a internet**
2. **Aguarde alguns minutos**
3. **Tente novamente**

### 4.3 Se o erro for "not-found":
1. **Verifique se o projeto está correto**
2. **Confirme o projectId no `lib/firebase.ts`**
3. **Verifique se o projeto está ativo**

---

## 📋 **PASSO 5: Teste Alternativo**

### 5.1 Teste com Regras Mais Permissivas
Se ainda não funcionar, use estas regras **MUITO permissivas**:

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

### 5.2 Teste no Firebase Console
1. Vá para **"Firestore Database"** → **"Data"**
2. Clique em **"Start collection"**
3. Coleção ID: `teste-manual`
4. Documento ID: `teste1`
5. Adicione um campo: `message` = `teste`
6. Clique em **"Save"**

Se conseguir salvar no console, o problema é nas regras.

---

## 🔍 **DIAGNÓSTICO RÁPIDO**

**Execute este código no console e me diga o resultado:**

```javascript
// Diagnóstico rápido
console.log('🔍 Diagnóstico iniciado...')

// 1. Verificar Firebase
if (typeof window !== 'undefined' && window.firebase) {
  console.log('✅ Firebase carregado')
  
  // 2. Teste de escrita
  window.firebase.firestore().collection('diagnostico').add({
    teste: true,
    timestamp: new Date()
  })
  .then(() => console.log('✅ Firebase funcionando!'))
  .catch((e) => console.log('❌ Erro:', e.code, e.message))
  
} else {
  console.log('❌ Firebase não carregado')
}
```

**Me diga exatamente o que aparece no console!** 🔍








