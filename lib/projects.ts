import { doc, setDoc, getDoc, getDocs, updateDoc, collection, query, where, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

export interface Project {
  id: string
  title: string
  description: string
  clientName: string
  clientEmail: string
  clientPhone: string
  budget: number
  deadline: string
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  assignedTo?: string
  assignedAt?: Date
  assignedBy?: string
  createdAt: Date
  updatedAt: Date
  category: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  requirements: string[]
  notes?: string
}

const PROJECTS_COLLECTION = 'projects'

/**
 * Criar novo projeto
 */
export async function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    // Gerar ID único e válido
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 11)
    const projectId = `project_${timestamp}_${randomStr}`
    
    console.log('🔍 Criando projeto com ID:', projectId)
    
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
    
    const newProject: Project = {
      ...projectData,
      id: projectId,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    // Garantir que o ID está definido no documento
    const projectDoc = {
      ...newProject,
      id: projectId, // Garantir que o ID está presente
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    await setDoc(projectRef, projectDoc)
    
    console.log(`✅ Projeto ${projectId} criado com sucesso`)
    console.log('🔍 Dados do projeto criado:', projectDoc)
    
    return projectId
  } catch (error) {
    console.error('❌ Erro ao criar projeto:', error)
    throw error
  }
}

/**
 * Obter todos os projetos
 */
export async function getAllProjects(): Promise<Project[]> {
  try {
    const projectsSnapshot = await getDocs(collection(db, PROJECTS_COLLECTION))
    
    const projects = projectsSnapshot.docs.map(doc => {
      const data = doc.data()
      const projectId = doc.id || `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      
      console.log('🔍 Processando projeto:', { docId: doc.id, projectId, hasData: !!data })
      
      const project = {
        id: projectId,
        title: data?.title || 'Título não definido',
        description: data?.description || 'Descrição não definida',
        clientName: data?.clientName || 'Cliente não definido',
        clientEmail: data?.clientEmail || 'Email não definido',
        clientPhone: data?.clientPhone || 'Telefone não definido',
        budget: data?.budget || 0,
        deadline: data?.deadline || new Date().toISOString(),
        status: data?.status || 'pending',
        assignedTo: data?.assignedTo,
        assignedAt: data?.assignedAt?.toDate(),
        assignedBy: data?.assignedBy,
        createdAt: data?.createdAt?.toDate() || new Date(),
        updatedAt: data?.updatedAt?.toDate() || new Date(),
        category: data?.category || 'Categoria não definida',
        priority: data?.priority || 'medium',
        requirements: data?.requirements || [],
        notes: data?.notes
      } as Project
      
      console.log('🔍 Projeto processado:', { id: project.id, title: project.title })
      return project
    })
    
    console.log(`✅ ${projects.length} projetos carregados`)
    return projects
  } catch (error) {
    console.error('❌ Erro ao buscar projetos:', error)
    return []
  }
}

/**
 * Obter projetos por status
 */
export async function getProjectsByStatus(status: Project['status']): Promise<Project[]> {
  try {
    const projectsQuery = query(
      collection(db, PROJECTS_COLLECTION),
      where('status', '==', status)
    )
    
    const projectsSnapshot = await getDocs(projectsQuery)
    
    return projectsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title || 'Título não definido',
        description: data.description || 'Descrição não definida',
        clientName: data.clientName || 'Cliente não definido',
        clientEmail: data.clientEmail || 'Email não definido',
        clientPhone: data.clientPhone || 'Telefone não definido',
        budget: data.budget || 0,
        deadline: data.deadline || new Date().toISOString(),
        status: data.status || 'pending',
        assignedTo: data.assignedTo,
        assignedAt: data.assignedAt?.toDate(),
        assignedBy: data.assignedBy,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        category: data.category || 'Categoria não definida',
        priority: data.priority || 'medium',
        requirements: data.requirements || [],
        notes: data.notes
      } as Project
    })
  } catch (error) {
    console.error('❌ Erro ao buscar projetos por status:', error)
    return []
  }
}

/**
 * Obter projetos pendentes (não atribuídos)
 */
export async function getPendingProjects(): Promise<Project[]> {
  return getProjectsByStatus('pending')
}

/**
 * Obter projetos atribuídos a um funcionário
 */
export async function getProjectsByEmployee(employeeUsername: string): Promise<Project[]> {
  try {
    const projectsQuery = query(
      collection(db, PROJECTS_COLLECTION),
      where('assignedTo', '==', employeeUsername)
    )
    
    const projectsSnapshot = await getDocs(projectsQuery)
    
    return projectsSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        title: data.title || 'Título não definido',
        description: data.description || 'Descrição não definida',
        clientName: data.clientName || 'Cliente não definido',
        clientEmail: data.clientEmail || 'Email não definido',
        clientPhone: data.clientPhone || 'Telefone não definido',
        budget: data.budget || 0,
        deadline: data.deadline || new Date().toISOString(),
        status: data.status || 'pending',
        assignedTo: data.assignedTo,
        assignedAt: data.assignedAt?.toDate(),
        assignedBy: data.assignedBy,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        category: data.category || 'Categoria não definida',
        priority: data.priority || 'medium',
        requirements: data.requirements || [],
        notes: data.notes
      } as Project
    })
  } catch (error) {
    console.error('❌ Erro ao buscar projetos do funcionário:', error)
    return []
  }
}

/**
 * Assumir venda/projeto
 */
export async function assumeProject(projectId: string, employeeUsername: string, employeeName: string): Promise<void> {
  try {
    // Validações de entrada
    if (!projectId || typeof projectId !== 'string') {
      throw new Error('ID do projeto inválido')
    }
    
    if (!employeeUsername || typeof employeeUsername !== 'string') {
      throw new Error('Username do funcionário inválido')
    }
    
    if (!employeeName || typeof employeeName !== 'string') {
      throw new Error('Nome do funcionário inválido')
    }

    console.log('🔍 Iniciando assumeProject:', { projectId, employeeUsername, employeeName })
    
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
    const projectDoc = await getDoc(projectRef)
    
    if (!projectDoc.exists()) {
      throw new Error('Projeto não encontrado')
    }
    
    const projectData = projectDoc.data() as Project
    
    if (!projectData) {
      throw new Error('Dados do projeto inválidos')
    }
    
    if (projectData.status !== 'pending') {
      throw new Error('Projeto já foi atribuído ou não está pendente')
    }
    
    await updateDoc(projectRef, {
      status: 'assigned',
      assignedTo: employeeUsername,
      assignedBy: employeeUsername,
      assignedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    console.log(`✅ Projeto ${projectId} assumido por ${employeeName} (${employeeUsername})`)
  } catch (error) {
    console.error('❌ Erro ao assumir projeto:', error)
    throw error
  }
}

/**
 * Atualizar status do projeto
 */
export async function updateProjectStatus(projectId: string, newStatus: Project['status']): Promise<void> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
    
    await updateDoc(projectRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    })
    
    console.log(`✅ Status do projeto ${projectId} atualizado para ${newStatus}`)
  } catch (error) {
    console.error('❌ Erro ao atualizar status do projeto:', error)
    throw error
  }
}

/**
 * Obter projeto por ID
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
  try {
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
    const projectDoc = await getDoc(projectRef)
    
    if (!projectDoc.exists()) {
      return null
    }
    
    const data = projectDoc.data()
    return {
      id: projectDoc.id,
      title: data.title || 'Título não definido',
      description: data.description || 'Descrição não definida',
      clientName: data.clientName || 'Cliente não definido',
      clientEmail: data.clientEmail || 'Email não definido',
      clientPhone: data.clientPhone || 'Telefone não definido',
      budget: data.budget || 0,
      deadline: data.deadline || new Date().toISOString(),
      status: data.status || 'pending',
      assignedTo: data.assignedTo,
      assignedAt: data.assignedAt?.toDate(),
      assignedBy: data.assignedBy,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      category: data.category || 'Categoria não definida',
      priority: data.priority || 'medium',
      requirements: data.requirements || [],
      notes: data.notes
    } as Project
  } catch (error) {
    console.error('❌ Erro ao buscar projeto:', error)
    return null
  }
}

/**
 * Excluir projeto
 */
export async function deleteProject(projectId: string): Promise<void> {
  try {
    const { deleteDoc } = await import('firebase/firestore')
    const projectRef = doc(db, PROJECTS_COLLECTION, projectId)
    
    await deleteDoc(projectRef)
    console.log(`✅ Projeto ${projectId} excluído com sucesso`)
  } catch (error) {
    console.error('❌ Erro ao excluir projeto:', error)
    throw error
  }
}

/**
 * Excluir todos os projetos
 */
export async function deleteAllProjects(): Promise<void> {
  try {
    const { deleteDoc } = await import('firebase/firestore')
    const projectsSnapshot = await getDocs(collection(db, PROJECTS_COLLECTION))
    
    console.log(`🗑️ Excluindo ${projectsSnapshot.docs.length} projetos...`)
    
    for (const doc of projectsSnapshot.docs) {
      await deleteDoc(doc.ref)
      console.log(`🗑️ Projeto ${doc.id} excluído`)
    }
    
    console.log('✅ Todos os projetos foram excluídos')
  } catch (error) {
    console.error('❌ Erro ao excluir todos os projetos:', error)
    throw error
  }
}

/**
 * Gerar PDF do comprovante do projeto
 */
export async function generateProjectReceipt(project: Project): Promise<void> {
  try {
    const { jsPDF } = await import('jspdf')
    
    const doc = new jsPDF()
    
    // Configurações do PDF
    doc.setFont('helvetica')
    doc.setFontSize(20)
    
    // Cabeçalho
    doc.setTextColor(220, 38, 38) // Vermelho CDforge
    doc.text('CDforge', 105, 20, { align: 'center' })
    doc.setFontSize(16)
    doc.setTextColor(100, 100, 100)
    doc.text('Comprovante de Pedido', 105, 30, { align: 'center' })
    
    // Linha separadora
    doc.setDrawColor(220, 38, 38)
    doc.line(20, 35, 190, 35)
    
    // Informações do projeto
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Detalhes do Projeto:', 20, 50)
    
    doc.setFontSize(12)
    doc.setTextColor(50, 50, 50)
    doc.text(`Título: ${project.title}`, 20, 65)
    doc.text(`Categoria: ${project.category}`, 20, 75)
    doc.text(`Prioridade: ${project.priority}`, 20, 85)
    doc.text(`Status: ${project.status}`, 20, 95)
         doc.text(`Orçamento: R$ ${project.budget?.toLocaleString('pt-BR') || '0'}`, 20, 105)
         doc.text(`Prazo: ${project.deadline ? new Date(project.deadline).toLocaleDateString('pt-BR') : 'Não definido'}`, 20, 115)
    
         // Descrição
     doc.text('Descrição:', 20, 135)
     const description = project.description || 'Descrição não fornecida'
     const descriptionLines = doc.splitTextToSize(description, 170)
     doc.text(descriptionLines, 20, 145)
    
    // Informações do cliente
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Informações do Cliente:', 20, 180)
    
    doc.setFontSize(12)
         doc.setTextColor(50, 50, 50)
     doc.text(`Nome: ${project.clientName || 'Não informado'}`, 20, 195)
     doc.text(`Email: ${project.clientEmail || 'Não informado'}`, 20, 205)
     doc.text(`Telefone: ${project.clientPhone || 'Não informado'}`, 20, 215)
    
         // Requisitos
     if (project.requirements && project.requirements.length > 0) {
       doc.setFontSize(14)
       doc.setTextColor(0, 0, 0)
       doc.text('Requisitos:', 20, 240)
       
       doc.setFontSize(10)
       doc.setTextColor(50, 50, 50)
       project.requirements.forEach((req, index) => {
         doc.text(`• ${req || 'Requisito não especificado'}`, 25, 250 + (index * 8))
       })
     }
    
    // Data e hora
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 20, 280)
    
    // Salvar PDF
    const fileName = `comprovante_${project.id}_${Date.now()}.pdf`
    doc.save(fileName)
    
    console.log(`✅ Comprovante gerado: ${fileName}`)
  } catch (error) {
    console.error('❌ Erro ao gerar comprovante:', error)
    throw error
  }
}

/**
 * Criar projetos de exemplo
 */
export async function createSampleProjects(): Promise<void> {
  try {
    const sampleProjects = [
      {
        title: 'Site E-commerce Completo',
        description: 'Desenvolvimento de loja virtual com sistema de pagamentos e gestão de estoque',
        clientName: 'João Silva',
        clientEmail: 'joao@empresa.com',
        clientPhone: '(11) 99999-9999',
        budget: 15000,
        deadline: '2024-02-15',
        category: 'E-commerce',
        priority: 'high' as const,
        requirements: ['Design responsivo', 'Sistema de pagamentos', 'Painel administrativo']
      },
      {
        title: 'App Mobile de Delivery',
        description: 'Aplicativo mobile para entrega de alimentos com geolocalização',
        clientName: 'Maria Santos',
        clientEmail: 'maria@restaurante.com',
        clientPhone: '(11) 88888-8888',
        budget: 25000,
        deadline: '2024-03-01',
        category: 'Mobile App',
        priority: 'urgent' as const,
        requirements: ['iOS e Android', 'Geolocalização', 'Sistema de avaliações']
      },
      {
        title: 'Sistema de Gestão Empresarial',
        description: 'Software completo para gestão de recursos humanos, financeiro e estoque',
        clientName: 'Carlos Oliveira',
        clientEmail: 'carlos@empresa.com',
        clientPhone: '(11) 77777-7777',
        budget: 35000,
        deadline: '2024-04-01',
        category: 'Sistema Web',
        priority: 'medium' as const,
        requirements: ['Módulos integrados', 'Relatórios avançados', 'Backup automático']
      },
      {
        title: 'Landing Page para Startup',
        description: 'Página de captura para startup de tecnologia com formulário de leads',
        clientName: 'Ana Costa',
        clientEmail: 'ana@startup.com',
        clientPhone: '(11) 66666-6666',
        budget: 5000,
        deadline: '2024-01-30',
        category: 'Landing Page',
        priority: 'low' as const,
        requirements: ['Design moderno', 'Formulário de captura', 'SEO otimizado']
      }
    ]
    
    for (const projectData of sampleProjects) {
      await createProject(projectData)
    }
    
    console.log('✅ Projetos de exemplo criados com sucesso')
  } catch (error) {
    console.error('❌ Erro ao criar projetos de exemplo:', error)
    throw error
  }
}
