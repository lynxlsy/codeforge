import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { getPredefinedEmployees, validateCredentials } from './dev-auth-config'

export interface PredefinedEmployee {
  username: string
  password: string
  name: string
  email: string
  role: 'admin' | 'dev' | 'funcionario' | 'viewer'
  type: 'dev' | 'funcionario'
  isActive: boolean
  lastLogin?: Date
  onlineStatus?: 'online' | 'offline'
  lastActivity?: Date
}

const EMPLOYEES_COLLECTION = 'predefined_employees'
const ONLINE_STATUS_COLLECTION = 'online_users'

/**
 * Limpar e recriar funcionários no Firebase
 */
export async function clearAndRecreateEmployees(): Promise<void> {
  try {
    console.log('🧹 LIMPEZA FORÇADA - Removendo TODOS os funcionários...')
    
    // Buscar todos os funcionários atuais
    const { collection, getDocs, deleteDoc } = await import('firebase/firestore')
    
    // Limpar coleção de funcionários
    const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION))
    console.log(`🗑️ Removendo ${employeesSnapshot.docs.length} funcionários antigos...`)
    
    for (const doc of employeesSnapshot.docs) {
      await deleteDoc(doc.ref)
      console.log(`🗑️ Funcionário ${doc.id} removido`)
    }
    
    // Limpar coleção de status online
    const onlineSnapshot = await getDocs(collection(db, ONLINE_STATUS_COLLECTION))
    console.log(`🗑️ Removendo ${onlineSnapshot.docs.length} status online antigos...`)
    
    for (const doc of onlineSnapshot.docs) {
      await deleteDoc(doc.ref)
      console.log(`🗑️ Status online ${doc.id} removido`)
    }
    
    // Limpar também a coleção antiga de funcionários se existir
    try {
      const oldEmployeesSnapshot = await getDocs(collection(db, 'employees'))
      console.log(`🗑️ Removendo ${oldEmployeesSnapshot.docs.length} funcionários da coleção antiga...`)
      
      for (const doc of oldEmployeesSnapshot.docs) {
        await deleteDoc(doc.ref)
        console.log(`🗑️ Funcionário antigo ${doc.id} removido`)
      }
    } catch (error) {
      console.log('ℹ️ Coleção antiga não encontrada, continuando...')
    }
    
    console.log('✅ LIMPEZA COMPLETA CONCLUÍDA')
    
    // Aguardar mais tempo para garantir que a limpeza foi processada
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Recriar apenas os funcionários predefinidos
    console.log('🔄 Recriando funcionários corretos...')
    await syncPredefinedEmployees()
    
    console.log('✅ FUNCIONÁRIOS RECRIADOS COM SUCESSO!')
    
  } catch (error) {
    console.error('❌ Erro na limpeza:', error)
    throw error
  }
}

/**
 * Sincronizar funcionários predefinidos com Firebase
 */
export async function syncPredefinedEmployees(): Promise<void> {
  try {
    console.log('🔄 Sincronizando funcionários predefinidos...')
    
    const predefinedEmployees = getPredefinedEmployees()
    console.log('📋 Funcionários predefinidos:', predefinedEmployees.map(e => e.username))
    
    for (const employee of predefinedEmployees) {
      const employeeRef = doc(db, EMPLOYEES_COLLECTION, employee.username)
      const employeeDoc = await getDoc(employeeRef)
      
      // SEMPRE sobrescrever com os dados corretos
      await setDoc(employeeRef, {
        ...employee,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      console.log(`✅ Funcionário ${employee.username} criado/atualizado no Firebase`)
    }
    
    console.log('✅ Sincronização concluída')
  } catch (error) {
    console.error('❌ Erro na sincronização:', error)
    throw error
  }
}

/**
 * Obter todos os funcionários predefinidos do Firebase
 */
export async function getPredefinedEmployeesFromFirebase(): Promise<PredefinedEmployee[]> {
  try {
    const { collection, getDocs } = await import('firebase/firestore')
    const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION))
    
    return employeesSnapshot.docs.map(doc => ({
      ...doc.data(),
      lastLogin: doc.data().lastLogin?.toDate(),
      lastActivity: doc.data().lastActivity?.toDate()
    })) as PredefinedEmployee[]
  } catch (error) {
    console.error('❌ Erro ao buscar funcionários:', error)
    return []
  }
}

/**
 * Função removida - cargos agora são definidos no código fonte
 * Não é mais possível alterar cargos via interface
 */

/**
 * Atualizar status online de um funcionário
 */
export async function updateEmployeeOnlineStatus(username: string, status: 'online' | 'offline'): Promise<void> {
  try {
    console.log(`🔄 Atualizando status online de ${username} para ${status}`)
    
    if (status === 'online') {
      // Marcar como online
      const onlineRef = doc(db, ONLINE_STATUS_COLLECTION, username)
      await setDoc(onlineRef, {
        username,
        status: 'online',
        lastActivity: serverTimestamp(),
        timestamp: serverTimestamp()
      })
    } else {
      // Marcar como offline
      const onlineRef = doc(db, ONLINE_STATUS_COLLECTION, username)
      await setDoc(onlineRef, {
        username,
        status: 'offline',
        lastActivity: serverTimestamp(),
        timestamp: serverTimestamp()
      })
    }
    
    // Atualizar também na coleção de funcionários
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, username)
    await updateDoc(employeeRef, {
      onlineStatus: status,
      lastActivity: serverTimestamp()
    })
    
    console.log(`✅ Status online de ${username} atualizado para ${status}`)
  } catch (error) {
    console.error('❌ Erro ao atualizar status online:', error)
    throw error
  }
}

/**
 * Obter funcionários online
 */
export async function getOnlineEmployees(): Promise<PredefinedEmployee[]> {
  try {
    const { collection, getDocs, query, where } = await import('firebase/firestore')
    const onlineSnapshot = await getDocs(query(
      collection(db, ONLINE_STATUS_COLLECTION),
      where('status', '==', 'online')
    ))
    
    const onlineUsernames = onlineSnapshot.docs.map(doc => doc.data().username)
    
    // Buscar dados completos dos funcionários online
    const allEmployees = await getPredefinedEmployeesFromFirebase()
    return allEmployees.filter(emp => onlineUsernames.includes(emp.username))
  } catch (error) {
    console.error('❌ Erro ao buscar funcionários online:', error)
    return []
  }
}

/**
 * Validar credenciais de funcionário predefinido
 */
export async function validatePredefinedEmployeeCredentials(username: string, password: string): Promise<PredefinedEmployee | null> {
  try {
    // Primeiro validar com dados locais
    const localUser = validateCredentials(username, password)
    if (!localUser) {
      return null
    }
    
    // Buscar dados completos do Firebase
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, username)
    const employeeDoc = await getDoc(employeeRef)
    
    if (!employeeDoc.exists()) {
      // Se não existe no Firebase, criar
      await setDoc(employeeRef, {
        ...localUser,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
    }
    
    // Atualizar último login
    await updateDoc(employeeRef, {
      lastLogin: serverTimestamp(),
      lastActivity: serverTimestamp()
    })
    
    // Marcar como online
    await updateEmployeeOnlineStatus(username, 'online')
    
    const firebaseData = employeeDoc.exists() ? employeeDoc.data() : localUser
    
    return {
      ...firebaseData,
      lastLogin: firebaseData.lastLogin?.toDate(),
      lastActivity: firebaseData.lastActivity?.toDate()
    } as PredefinedEmployee
  } catch (error) {
    console.error('❌ Erro ao validar credenciais:', error)
    return null
  }
}

/**
 * Fazer logout de funcionário (marcar como offline)
 */
export async function logoutPredefinedEmployee(username: string): Promise<void> {
  try {
    console.log(`🔄 Fazendo logout de ${username}`)
    await updateEmployeeOnlineStatus(username, 'offline')
    console.log(`✅ Logout de ${username} concluído`)
  } catch (error) {
    console.error('❌ Erro ao fazer logout:', error)
    throw error
  }
}
