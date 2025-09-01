// 🔍 DEBUG DO SISTEMA DE LOGIN
// Execute este arquivo no console do navegador para diagnosticar problemas

console.log('🔍 INICIANDO DEBUG DO SISTEMA DE LOGIN...')

// 1. Verificar configuração do Firebase
console.log('📋 1. Verificando configuração do Firebase...')
try {
  // Verificar se o Firebase está disponível
  if (typeof window !== 'undefined' && window.firebase) {
    console.log('✅ Firebase disponível no window')
  } else {
    console.log('❌ Firebase não encontrado no window')
  }
} catch (error) {
  console.log('❌ Erro ao verificar Firebase:', error)
}

// 2. Verificar usuários autorizados
console.log('📋 2. Verificando usuários autorizados...')
try {
  // Importar configuração de usuários
  import('@/lib/dev-auth-config').then(({ getAuthorizedUsers, getPredefinedEmployees }) => {
    const authorizedUsers = getAuthorizedUsers()
    const predefinedEmployees = getPredefinedEmployees()
    
    console.log('✅ Usuários autorizados:', authorizedUsers)
    console.log('✅ Funcionários predefinidos:', predefinedEmployees)
    
    // Testar validação de credenciais
    console.log('📋 3. Testando validação de credenciais...')
    
    // Teste com usuário dev
    const devTest = predefinedEmployees.find(u => u.username === 'dev')
    if (devTest) {
      console.log('✅ Usuário dev encontrado:', devTest)
      console.log('🔑 Credenciais dev: username="dev", password="D"')
    } else {
      console.log('❌ Usuário dev NÃO encontrado!')
    }
    
    // Teste com outros usuários
    predefinedEmployees.forEach(user => {
      console.log(`🔑 ${user.username}: ${user.password} (${user.type})`)
    })
    
  }).catch(error => {
    console.log('❌ Erro ao importar configuração:', error)
  })
} catch (error) {
  console.log('❌ Erro ao verificar usuários:', error)
}

// 3. Verificar contexto de autenticação
console.log('📋 4. Verificando contexto de autenticação...')
try {
  if (typeof window !== 'undefined') {
    // Verificar se há sessão salva
    const savedSession = localStorage.getItem('cdforge-dev-session')
    console.log('💾 Sessão salva:', savedSession ? 'SIM' : 'NÃO')
    
    if (savedSession) {
      console.log('📄 Conteúdo da sessão:', savedSession)
    }
  }
} catch (error) {
  console.log('❌ Erro ao verificar contexto:', error)
}

// 4. Verificar Firebase Firestore
console.log('📋 5. Verificando Firebase Firestore...')
try {
  if (typeof window !== 'undefined') {
    // Verificar se há erros de rede
    console.log('🌐 Verificando conectividade...')
    
    // Testar conexão com Firebase
    fetch('https://cdforge.firebaseapp.com/.well-known/__/firebase/init.json')
      .then(response => {
        if (response.ok) {
          console.log('✅ Firebase acessível')
        } else {
          console.log('❌ Firebase retornou erro:', response.status)
        }
      })
      .catch(error => {
        console.log('❌ Erro ao acessar Firebase:', error)
      })
  }
} catch (error) {
  console.log('❌ Erro ao verificar Firestore:', error)
}

// 5. Instruções para o usuário
console.log('📋 6. INSTRUÇÕES PARA RESOLVER O PROBLEMA:')
console.log('')
console.log('🔑 CREDENCIAIS DE TESTE:')
console.log('   Usuário: dev')
console.log('   Senha: D')
console.log('')
console.log('🔍 SE O LOGIN AINDA NÃO FUNCIONAR:')
console.log('   1. Verifique se o Firebase está configurado corretamente')
console.log('   2. Verifique as regras de segurança do Firestore')
console.log('   3. Limpe o cache do navegador (Ctrl+F5)')
console.log('   4. Verifique se há erros no console')
console.log('')
console.log('📱 TESTE NO MODAL DE LOGIN:')
console.log('   1. Abra o modal de login dev')
console.log('   2. Digite: dev (usuário)')
console.log('   3. Digite: D (senha)')
console.log('   4. Clique em "Entrar"')
console.log('   5. Verifique o console para mensagens de debug')
console.log('')
console.log('✅ DEBUG CONCLUÍDO! Verifique as mensagens acima.')

// Função para testar login diretamente
window.testDevLogin = function() {
  console.log('🧪 TESTANDO LOGIN DIRETAMENTE...')
  
  // Simular credenciais
  const username = 'dev'
  const password = 'D'
  
  console.log('🔑 Credenciais:', { username, password })
  
  // Verificar se as credenciais são válidas
  import('@/lib/dev-auth-config').then(({ validateCredentials }) => {
    const result = validateCredentials(username, password)
    console.log('✅ Resultado da validação:', result)
    
    if (result) {
      console.log('🎉 Credenciais válidas! O problema pode estar no Firebase')
    } else {
      console.log('❌ Credenciais inválidas! Verifique a configuração')
    }
  }).catch(error => {
    console.log('❌ Erro ao testar validação:', error)
  })
}

console.log('🧪 Use window.testDevLogin() para testar o login diretamente')





