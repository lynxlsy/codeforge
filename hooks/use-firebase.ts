import { useState, useEffect } from 'react'
import type { Project, ContactMethod, PricingConfig, ServicePlan } from '@/lib/types'

// Verificar se estamos no cliente
const isClient = typeof window !== 'undefined'

// Hook para projetos
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = async () => {
    if (!isClient) return
    
    try {
      setLoading(true)
      setError(null)
      const { projectsService } = await import('@/lib/firebase-services')
      const data = await projectsService.getAll()
      setProjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar projetos')
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { projectsService } = await import('@/lib/firebase-services')
      const id = await projectsService.create(project)
      await fetchProjects() // Recarregar lista
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto')
      throw err
    }
  }

  const updateProject = async (id: string, updates: Partial<Project>) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { projectsService } = await import('@/lib/firebase-services')
      await projectsService.update(id, updates)
      await fetchProjects() // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar projeto')
      throw err
    }
  }

  const deleteProject = async (id: string) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { projectsService } = await import('@/lib/firebase-services')
      await projectsService.delete(id)
      await fetchProjects() // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar projeto')
      throw err
    }
  }

  useEffect(() => {
    if (isClient) {
      fetchProjects()
    }
  }, [])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject
  }
}

// Hook para contatos
export function useContacts() {
  const [contacts, setContacts] = useState<ContactMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = async () => {
    if (!isClient) return
    
    try {
      setLoading(true)
      setError(null)
      const { contactsService } = await import('@/lib/firebase-services')
      const data = await contactsService.getAll()
      setContacts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }

  const createContact = async (contact: Omit<ContactMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { contactsService } = await import('@/lib/firebase-services')
      const id = await contactsService.create(contact)
      await fetchContacts() // Recarregar lista
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar contato')
      throw err
    }
  }

  const updateContact = async (id: string, updates: Partial<ContactMethod>) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { contactsService } = await import('@/lib/firebase-services')
      await contactsService.update(id, updates)
      await fetchContacts() // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar contato')
      throw err
    }
  }

  const deleteContact = async (id: string) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { contactsService } = await import('@/lib/firebase-services')
      await contactsService.delete(id)
      await fetchContacts() // Recarregar lista
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar contato')
      throw err
    }
  }

  useEffect(() => {
    if (isClient) {
      fetchContacts()
    }
  }, [])

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact
  }
}

// Hook para configurações de preço
export function usePricing() {
  const [config, setConfig] = useState<PricingConfig | null>(null)
  const [servicePlans, setServicePlans] = useState<ServicePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPricingData = async () => {
    if (!isClient) return
    
    try {
      setLoading(true)
      setError(null)
      const { pricingService } = await import('@/lib/firebase-services')
      const [configData, plansData] = await Promise.all([
        pricingService.getConfig(),
        pricingService.getServicePlans()
      ])
      setConfig(configData)
      setServicePlans(plansData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações de preço')
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = async (newConfig: PricingConfig) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { pricingService } = await import('@/lib/firebase-services')
      await pricingService.updateConfig(newConfig)
      setConfig(newConfig)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar configuração')
      throw err
    }
  }

  const createServicePlan = async (plan: Omit<ServicePlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { pricingService } = await import('@/lib/firebase-services')
      const id = await pricingService.createServicePlan(plan)
      await fetchPricingData() // Recarregar dados
      return id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar plano de serviço')
      throw err
    }
  }

  const updateServicePlan = async (id: string, updates: Partial<ServicePlan>) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { pricingService } = await import('@/lib/firebase-services')
      await pricingService.updateServicePlan(id, updates)
      await fetchPricingData() // Recarregar dados
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar plano de serviço')
      throw err
    }
  }

  const deleteServicePlan = async (id: string) => {
    if (!isClient) throw new Error('Não disponível no servidor')
    
    try {
      setError(null)
      const { pricingService } = await import('@/lib/firebase-services')
      await pricingService.deleteServicePlan(id)
      await fetchPricingData() // Recarregar dados
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar plano de serviço')
      throw err
    }
  }

  useEffect(() => {
    if (isClient) {
      fetchPricingData()
    }
  }, [])

  return {
    config,
    servicePlans,
    loading,
    error,
    fetchPricingData,
    updateConfig,
    createServicePlan,
    updateServicePlan,
    deleteServicePlan
  }
}

// Hook para estatísticas
export function useStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    if (!isClient) return
    
    try {
      setLoading(true)
      setError(null)
      const { statsService } = await import('@/lib/firebase-services')
      const data = await statsService.getDashboardStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isClient) {
      fetchStats()
    }
  }, [])

  return {
    stats,
    loading,
    error,
    fetchStats
  }
}
