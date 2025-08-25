import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Configuração do Firebase - Credenciais reais
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

// Exportar instâncias
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Analytics condicional - só inicializa no cliente
let analytics: any = null
if (typeof window !== 'undefined') {
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app)
  }).catch(() => {
    // Analytics não disponível ou erro
    console.log('Firebase Analytics não disponível')
  })
}

export { analytics }
export default app
