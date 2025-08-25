import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import type { Project, ContactMethod, PricingConfig, ServicePlan } from './types'

// ===== PROJETOS =====
export const projectsService = {
  // Buscar todos os projetos
  async getAll(): Promise<Project[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'projects'))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[]
    } catch (error) {
      console.error('Erro ao buscar projetos:', error)
      throw error
    }
  },

  // Buscar projeto por ID
  async getById(id: string): Promise<Project | null> {
    try {
      const docRef = doc(db, 'projects', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Project
      }
      return null
    } catch (error) {
      console.error('Erro ao buscar projeto:', error)
      throw error
    }
  },

  // Criar novo projeto
  async create(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Remover campos undefined antes de enviar para o Firebase
      const cleanProject = Object.fromEntries(
        Object.entries(project).filter(([_, value]) => value !== undefined)
      )
      
      const docRef = await addDoc(collection(db, 'projects'), {
        ...cleanProject,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar projeto:', error)
      throw error
    }
  },

  // Atualizar projeto
  async update(id: string, updates: Partial<Project>): Promise<void> {
    try {
      const docRef = doc(db, 'projects', id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error)
      throw error
    }
  },

  // Deletar projeto
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'projects', id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Erro ao deletar projeto:', error)
      throw error
    }
  },

  // Buscar projetos por status
  async getByStatus(status: string): Promise<Project[]> {
    try {
      const q = query(
        collection(db, 'projects'),
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[]
    } catch (error) {
      console.error('Erro ao buscar projetos por status:', error)
      throw error
    }
  }
}

// ===== CONTATOS =====
export const contactsService = {
  // Buscar todos os contatos
  async getAll(): Promise<ContactMethod[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'contacts'))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMethod[]
    } catch (error) {
      console.error('Erro ao buscar contatos:', error)
      throw error
    }
  },

  // Buscar contato por ID
  async getById(id: string): Promise<ContactMethod | null> {
    try {
      const docRef = doc(db, 'contacts', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as ContactMethod
      }
      return null
    } catch (error) {
      console.error('Erro ao buscar contato:', error)
      throw error
    }
  },

  // Criar novo contato
  async create(contact: Omit<ContactMethod, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'contacts'), {
        ...contact,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar contato:', error)
      throw error
    }
  },

  // Atualizar contato
  async update(id: string, updates: Partial<ContactMethod>): Promise<void> {
    try {
      const docRef = doc(db, 'contacts', id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar contato:', error)
      throw error
    }
  },

  // Deletar contato
  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'contacts', id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Erro ao deletar contato:', error)
      throw error
    }
  },

  // Buscar contatos ativos
  async getActive(): Promise<ContactMethod[]> {
    try {
      const q = query(
        collection(db, 'contacts'),
        where('isActive', '==', true),
        orderBy('priority', 'asc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMethod[]
    } catch (error) {
      console.error('Erro ao buscar contatos ativos:', error)
      throw error
    }
  }
}

// ===== CONFIGURAÇÕES DE PREÇO =====
export const pricingService = {
  // Buscar configuração de preços
  async getConfig(): Promise<PricingConfig | null> {
    try {
      const docRef = doc(db, 'config', 'pricing')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return docSnap.data() as PricingConfig
      }
      return null
    } catch (error) {
      console.error('Erro ao buscar configuração de preços:', error)
      throw error
    }
  },

  // Atualizar configuração de preços
  async updateConfig(config: PricingConfig): Promise<void> {
    try {
      const docRef = doc(db, 'config', 'pricing')
      await updateDoc(docRef, {
        ...config,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar configuração de preços:', error)
      throw error
    }
  },

  // Buscar planos de serviço
  async getServicePlans(): Promise<ServicePlan[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'servicePlans'))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ServicePlan[]
    } catch (error) {
      console.error('Erro ao buscar planos de serviço:', error)
      throw error
    }
  },

  // Criar novo plano de serviço
  async createServicePlan(plan: Omit<ServicePlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'servicePlans'), {
        ...plan,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Erro ao criar plano de serviço:', error)
      throw error
    }
  },

  // Atualizar plano de serviço
  async updateServicePlan(id: string, updates: Partial<ServicePlan>): Promise<void> {
    try {
      const docRef = doc(db, 'servicePlans', id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Erro ao atualizar plano de serviço:', error)
      throw error
    }
  },

  // Deletar plano de serviço
  async deleteServicePlan(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'servicePlans', id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Erro ao deletar plano de serviço:', error)
      throw error
    }
  }
}

// ===== ESTATÍSTICAS =====
export const statsService = {
  // Buscar estatísticas gerais
  async getDashboardStats() {
    try {
      const [projectsSnapshot, contactsSnapshot] = await Promise.all([
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'contacts'))
      ])

      const totalProjects = projectsSnapshot.size
      const pendingProjects = projectsSnapshot.docs.filter(doc => doc.data().status === 'pending').length
      const approvedProjects = projectsSnapshot.docs.filter(doc => doc.data().status === 'approved').length
      const totalContacts = contactsSnapshot.size
      const activeContacts = contactsSnapshot.docs.filter(doc => doc.data().isActive).length

      return {
        totalProjects,
        pendingProjects,
        approvedProjects,
        totalContacts,
        activeContacts
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  }
}

