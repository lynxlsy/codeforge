// Teste simples do Firebase
// Execute este código no console do navegador para testar

console.log('🧪 Iniciando teste do Firebase...')

// Teste 1: Verificar se o Firebase está carregado
if (typeof window !== 'undefined' && window.firebase) {
  console.log('✅ Firebase carregado no window')
} else {
  console.log('❌ Firebase não encontrado no window')
}

// Teste 2: Verificar se as configurações estão corretas
const firebaseConfig = {
  apiKey: "AIzaSyDMpAYNiZz3kNou_iCBZwc8PzgSREgONKU",
  authDomain: "cdforge.firebaseapp.com",
  projectId: "cdforge",
  storageBucket: "cdforge.firebasestorage.app",
  messagingSenderId: "706766490167",
  appId: "1:706766490167:web:da36d5c880b2654d168db2",
  measurementId: "G-ERMTG9SM9Q"
}

console.log('🔧 Configurações do Firebase:', firebaseConfig)

// Teste 3: Verificar se o projeto está correto
console.log('📋 Projeto ID:', firebaseConfig.projectId)

// Teste 4: Verificar se o Firestore está disponível
if (typeof window !== 'undefined' && window.firebase && window.firebase.firestore) {
  console.log('✅ Firestore disponível')
  
  // Teste 5: Tentar uma operação simples
  const db = window.firebase.firestore()
  
  // Teste de leitura
  db.collection('test').get()
    .then((snapshot) => {
      console.log('✅ Teste de leitura bem-sucedido')
      console.log('📊 Documentos na coleção test:', snapshot.size)
    })
    .catch((error) => {
      console.log('❌ Erro no teste de leitura:', error)
      console.log('🔍 Código do erro:', error.code)
      console.log('📝 Mensagem do erro:', error.message)
    })
  
  // Teste de escrita
  db.collection('test').add({
    timestamp: new Date(),
    message: 'Teste de escrita'
  })
    .then((docRef) => {
      console.log('✅ Teste de escrita bem-sucedido')
      console.log('📄 ID do documento criado:', docRef.id)
    })
    .catch((error) => {
      console.log('❌ Erro no teste de escrita:', error)
      console.log('🔍 Código do erro:', error.code)
      console.log('📝 Mensagem do erro:', error.message)
    })
    
} else {
  console.log('❌ Firestore não disponível')
}

console.log('🧪 Teste concluído!')








