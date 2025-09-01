const { initializeApp } = require('firebase/app')
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore')

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDMpAYNiZz3kNou_iCBZwc8PzgSREgONKU",
  authDomain: "cdforge.firebaseapp.com",
  projectId: "cdforge",
  storageBucket: "cdforge.firebasestorage.app",
  messagingSenderId: "706766490167",
  appId: "1:706766490167:web:da36d5c880b2654d168db2",
  measurementId: "G-ERMTG9SM9Q"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Etiquetas padrão para as ferramentas
const defaultLabels = [
  // Plataformas de Download - Todas em desenvolvimento
  { name: "Spotify", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "TikTok", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "YouTube", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "Instagram", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "Pinterest", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "Discord", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "WhatsApp", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "Telegram", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  
  // Conversores - Todos em desenvolvimento
  { name: "PNG → PDF", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "JPG → PDF", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "PNG → SVG", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "JPG → PNG", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "PDF → DOCX", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "MP4 → MP3", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  { name: "WAV → MP3", status: "development", color: "#3B82F6", description: "Em desenvolvimento" },
  
  // Removedor de Fundo
  { name: "Removedor de Fundo", status: "available", color: "#10B981", description: "Disponível" },
]

async function initializeToolLabels() {
  console.log('🚀 Inicializando etiquetas das ferramentas no Firebase...')
  
  try {
    for (const label of defaultLabels) {
      const docRef = doc(collection(db, 'toolLabels'))
      await setDoc(docRef, {
        ...label,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log(`✅ Etiqueta criada: ${label.name}`)
    }
    
    console.log('🎉 Todas as etiquetas foram inicializadas com sucesso!')
    console.log('📝 Agora você pode gerenciar as etiquetas na área DEV')
    
  } catch (error) {
    console.error('❌ Erro ao inicializar etiquetas:', error)
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  initializeToolLabels()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Erro fatal:', error)
      process.exit(1)
    })
}

module.exports = { initializeToolLabels }
