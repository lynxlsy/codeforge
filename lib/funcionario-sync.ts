import { db } from './firebase'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore'

// Tipos para os dados dos funcionários
export interface FuncionarioStats {
  totalProjects: number
  completedProjects: number
  pendingProjects: number
  totalEarnings: number
  memberSince: string
  status: 'ativo' | 'inativo' | 'suspenso'
  performance: {
    deliveryRate: number
    averageTime: number
  }
  monthlyGoal: {
    target: number
    completed: number
    percentage: number
  }
}

export interface FuncionarioData {
  id: string
  username: string
  email: string
  role: string
  stats: FuncionarioStats
  lastSync: Date
}

// Tipos para os dados da equipe
export interface TeamMember {
  id: string
  name: string
  role: string
  description: string
  specialties: string[]
  icon: string
  color: string
  bgColor: string
  borderColor: string
  isActive: boolean
  joinedAt: Date
  updatedAt: Date
}

export interface TeamData {
  members: TeamMember[]
  totalMembers: number
  activeMembers: number
  lastSync: Date
}

// Tipos para gerenciamento de funcionários
export interface Employee {
  id: string
  username: string
  email: string
  password: string
  role: 'dev' | 'funcionario'
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  lastLogin?: Date
}

// Coleções do Firestore
const FUNCIONARIOS_COLLECTION = 'funcionarios'
const FUNCIONARIO_STATS_COLLECTION = 'funcionario_stats'
const PROJECTS_COLLECTION = 'projects'
const ORDERS_COLLECTION = 'orders'
const TEAM_COLLECTION = 'team'
const TEAM_MEMBERS_COLLECTION = 'team_members'
const EMPLOYEES_COLLECTION = 'employees'

/**
 * Sincroniza dados básicos do funcionário
 */
export async function syncFuncionarioBasicData(userId: string, userData: any): Promise<void> {
  try {
    const funcionarioRef = doc(db, FUNCIONARIOS_COLLECTION, userId)
    
    const funcionarioData = {
      id: userId,
      username: userData.username,
      email: userData.email,
      role: 'funcionario',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(funcionarioRef, funcionarioData, { merge: true })
    console.log('✅ Dados básicos do funcionário sincronizados')
  } catch (error) {
    console.error('❌ Erro ao sincronizar dados básicos:', error)
    throw error
  }
}

/**
 * Calcula e sincroniza estatísticas do funcionário
 */
export async function syncFuncionarioStats(userId: string): Promise<FuncionarioStats> {
  try {
    // Buscar projetos do funcionário
    const projectsQuery = query(
      collection(db, PROJECTS_COLLECTION),
      where('assignedTo', '==', userId)
    )
    
    const projectsSnapshot = await getDocs(projectsQuery)
    const projects = projectsSnapshot.docs.map(doc => doc.data())

    // Calcular estatísticas
    const totalProjects = projects.length
    const completedProjects = projects.filter(p => p.status === 'completed').length
    const pendingProjects = projects.filter(p => p.status === 'pending' || p.status === 'in_progress').length
    
    const totalEarnings = projects
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + (parseFloat(p.budget || '0') || 0), 0)

    // Calcular performance
    const completedWithTime = projects.filter(p => p.status === 'completed' && p.completedAt && p.createdAt)
    const deliveryRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
    
    const averageTime = completedWithTime.length > 0 
      ? completedWithTime.reduce((sum, p) => {
          const start = new Date(p.createdAt.toDate())
          const end = new Date(p.completedAt.toDate())
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) // dias
        }, 0) / completedWithTime.length
      : 0

    // Buscar dados do funcionário para memberSince
    const funcionarioRef = doc(db, FUNCIONARIOS_COLLECTION, userId)
    const funcionarioDoc = await getDoc(funcionarioRef)
    const memberSince = funcionarioDoc.exists() 
      ? funcionarioDoc.data().createdAt?.toDate().toLocaleDateString('pt-BR', { 
          year: 'numeric', 
          month: 'long' 
        })
      : new Date().toLocaleDateString('pt-BR', { year: 'numeric', month: 'long' })

    // Calcular meta mensal
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const monthlyProjects = projects.filter(p => {
      const projectDate = p.createdAt?.toDate() || new Date()
      return projectDate.getMonth() === currentMonth && projectDate.getFullYear() === currentYear
    })
    
    const monthlyCompleted = monthlyProjects.filter(p => p.status === 'completed').length
    const monthlyTarget = 15 // Meta padrão
    const monthlyPercentage = (monthlyCompleted / monthlyTarget) * 100

    const stats: FuncionarioStats = {
      totalProjects,
      completedProjects,
      pendingProjects,
      totalEarnings,
      memberSince,
      status: 'ativo',
      performance: {
        deliveryRate: Math.round(deliveryRate),
        averageTime: Math.round(averageTime)
      },
      monthlyGoal: {
        target: monthlyTarget,
        completed: monthlyCompleted,
        percentage: Math.round(monthlyPercentage)
      }
    }

    // Salvar estatísticas no Firestore
    const statsRef = doc(db, FUNCIONARIO_STATS_COLLECTION, userId)
    await setDoc(statsRef, {
      ...stats,
      lastSync: serverTimestamp()
    }, { merge: true })

    console.log('✅ Estatísticas do funcionário sincronizadas')
    return stats
  } catch (error) {
    console.error('❌ Erro ao sincronizar estatísticas:', error)
    throw error
  }
}

/**
 * Busca dados sincronizados do funcionário
 */
export async function getFuncionarioData(userId: string): Promise<FuncionarioData | null> {
  try {
    const [funcionarioDoc, statsDoc] = await Promise.all([
      getDoc(doc(db, FUNCIONARIOS_COLLECTION, userId)),
      getDoc(doc(db, FUNCIONARIO_STATS_COLLECTION, userId))
    ])

    if (!funcionarioDoc.exists()) {
      return null
    }

    const funcionarioData = funcionarioDoc.data()
    const statsData = statsDoc.exists() ? statsDoc.data() : null

    return {
      id: userId,
      username: funcionarioData.username,
      email: funcionarioData.email,
      role: funcionarioData.role,
      stats: (statsData as any as FuncionarioStats) || {
        totalProjects: 0,
        completedProjects: 0,
        pendingProjects: 0,
        totalEarnings: 0,
        memberSince: 'Aguardando sincronização',
        status: 'ativo',
        performance: {
          deliveryRate: 0,
          averageTime: 0
        },
        monthlyGoal: {
          target: 15,
          completed: 0,
          percentage: 0
        }
      },
      lastSync: statsData?.lastSync?.toDate() || new Date()
    }
  } catch (error) {
    console.error('❌ Erro ao buscar dados do funcionário:', error)
    return null
  }
}

/**
 * Listener em tempo real para dados do funcionário
 */
export function subscribeToFuncionarioData(
  userId: string, 
  callback: (data: FuncionarioData | null) => void
): () => void {
  const funcionarioRef = doc(db, FUNCIONARIOS_COLLECTION, userId)
  const statsRef = doc(db, FUNCIONARIO_STATS_COLLECTION, userId)

  const unsubscribeFuncionario = onSnapshot(funcionarioRef, async (funcionarioDoc) => {
    if (funcionarioDoc.exists()) {
      const funcionarioData = funcionarioDoc.data()
      const statsDoc = await getDoc(statsRef)
      const statsData = statsDoc.exists() ? statsDoc.data() : null

      const data: FuncionarioData = {
        id: userId,
        username: funcionarioData.username,
        email: funcionarioData.email,
        role: funcionarioData.role,
        stats: (statsData as any as FuncionarioStats) || {
          totalProjects: 0,
          completedProjects: 0,
          pendingProjects: 0,
          totalEarnings: 0,
          memberSince: 'Aguardando sincronização',
          status: 'ativo',
          performance: {
            deliveryRate: 0,
            averageTime: 0
          },
          monthlyGoal: {
            target: 15,
            completed: 0,
            percentage: 0
          }
        },
        lastSync: statsData?.lastSync?.toDate() || new Date()
      }

      callback(data)
    } else {
      callback(null)
    }
  })

  return unsubscribeFuncionario
}

/**
 * Sincronização completa do funcionário
 */
export async function fullSyncFuncionario(userId: string, userData: any): Promise<FuncionarioData> {
  try {
    console.log('🔄 Iniciando sincronização completa do funcionário...')
    
    // 1. Sincronizar dados básicos
    await syncFuncionarioBasicData(userId, userData)
    
    // 2. Sincronizar estatísticas
    const stats = await syncFuncionarioStats(userId)
    
    // 3. Buscar dados completos
    const funcionarioData = await getFuncionarioData(userId)
    
    if (!funcionarioData) {
      throw new Error('Falha ao buscar dados do funcionário após sincronização')
    }

    console.log('✅ Sincronização completa finalizada')
    return funcionarioData
  } catch (error) {
    console.error('❌ Erro na sincronização completa:', error)
    throw error
  }
}

/**
 * Atualizar status do funcionário
 */
export async function updateFuncionarioStatus(
  userId: string, 
  status: 'ativo' | 'inativo' | 'suspenso'
): Promise<void> {
  try {
    const statsRef = doc(db, FUNCIONARIO_STATS_COLLECTION, userId)
    await updateDoc(statsRef, {
      status,
      updatedAt: serverTimestamp()
    })
    console.log('✅ Status do funcionário atualizado')
  } catch (error) {
    console.error('❌ Erro ao atualizar status:', error)
    throw error
  }
}

/**
 * Verificar se precisa sincronizar (última sincronização > 5 minutos)
 */
export function needsSync(lastSync: Date): boolean {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  return lastSync < fiveMinutesAgo
}

// ============================================================================
// FUNÇÕES DE SINCRONIZAÇÃO DA EQUIPE
// ============================================================================

/**
 * Sincroniza dados básicos da equipe
 */
export async function syncTeamBasicData(): Promise<void> {
  try {
    const teamRef = doc(db, TEAM_COLLECTION, 'main')
    
    const teamData = {
      id: 'main',
      name: 'Trio Forge',
      description: 'Especialistas focados em administrar seu negócio, fazer você alavancar e resolver problemas com soluções digitais inovadoras.',
      totalMembers: 3,
      activeMembers: 3,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(teamRef, teamData, { merge: true })
    console.log('✅ Dados básicos da equipe sincronizados')
  } catch (error) {
    console.error('❌ Erro ao sincronizar dados básicos da equipe:', error)
    throw error
  }
}

/**
 * Sincroniza dados dos membros da equipe
 */
export async function syncTeamMembers(): Promise<TeamMember[]> {
  try {
    // Dados padrão da equipe (pode ser substituído por dados do Firebase)
    const defaultMembers: TeamMember[] = [
      {
        id: 'melke',
        name: 'Melke',
        role: 'Tech Lead & Designer',
        description: 'Especialista em desenvolvimento web e design criativo. Transforma ideias em interfaces incríveis.',
        specialties: ['Sites & HTML', 'Automação de Códigos', 'Design UI/UX'],
        icon: 'Code',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/20',
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'zanesco',
        name: 'Zanesco',
        role: 'Bot Master',
        description: 'Mestre na criação de bots inteligentes e automações que revolucionam processos.',
        specialties: ['Criação de Bots', 'Automação Avançada', 'Sistemas Inteligentes'],
        icon: 'Bot',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: 'pedro',
        name: 'Pedro',
        role: 'Sales & Support Lead',
        description: 'Líder em vendas e suporte, garante que cada cliente tenha a melhor experiência possível.',
        specialties: ['Vendas', 'Suporte Técnico', 'Gestão de Clientes'],
        icon: 'ShoppingCart',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        isActive: true,
        joinedAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ]

    // Salvar cada membro no Firestore
    for (const member of defaultMembers) {
      const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, member.id)
      await setDoc(memberRef, {
        ...member,
        joinedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true })
    }

    console.log('✅ Membros da equipe sincronizados')
    return defaultMembers
  } catch (error) {
    console.error('❌ Erro ao sincronizar membros da equipe:', error)
    throw error
  }
}

/**
 * Busca dados da equipe sincronizados
 */
export async function getTeamData(): Promise<TeamData | null> {
  try {
    const [teamDoc, membersSnapshot] = await Promise.all([
      getDoc(doc(db, TEAM_COLLECTION, 'main')),
      getDocs(collection(db, TEAM_MEMBERS_COLLECTION))
    ])

    const teamData = teamDoc.exists() ? teamDoc.data() : null
    const members = membersSnapshot.docs.map(doc => ({
      ...doc.data(),
      joinedAt: doc.data().joinedAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date()
    })) as TeamMember[]

    return {
      members: members.filter(m => m.isActive),
      totalMembers: members.length,
      activeMembers: members.filter(m => m.isActive).length,
      lastSync: teamData?.updatedAt?.toDate() || new Date()
    }
  } catch (error) {
    console.error('❌ Erro ao buscar dados da equipe:', error)
    return null
  }
}

/**
 * Listener em tempo real para dados da equipe
 */
export function subscribeToTeamData(
  callback: (data: TeamData | null) => void
): () => void {
  const teamRef = doc(db, TEAM_COLLECTION, 'main')
  const membersRef = collection(db, TEAM_MEMBERS_COLLECTION)

  const unsubscribeTeam = onSnapshot(teamRef, async (teamDoc) => {
    try {
      const membersSnapshot = await getDocs(membersRef)
      const members = membersSnapshot.docs.map(doc => ({
        ...doc.data(),
        joinedAt: doc.data().joinedAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as TeamMember[]

      const data: TeamData = {
        members: members.filter(m => m.isActive),
        totalMembers: members.length,
        activeMembers: members.filter(m => m.isActive).length,
        lastSync: teamDoc.exists() ? teamDoc.data().updatedAt?.toDate() || new Date() : new Date()
      }

      callback(data)
    } catch (error) {
      console.error('❌ Erro no listener da equipe:', error)
      callback(null)
    }
  })

  return unsubscribeTeam
}

/**
 * Sincronização completa da equipe
 */
export async function fullSyncTeam(): Promise<TeamData> {
  try {
    console.log('🔄 Iniciando sincronização completa da equipe...')
    
    // 1. Sincronizar dados básicos da equipe
    await syncTeamBasicData()
    
    // 2. Sincronizar membros da equipe
    const members = await syncTeamMembers()
    
    // 3. Buscar dados completos
    const teamData = await getTeamData()
    
    if (!teamData) {
      throw new Error('Falha ao buscar dados da equipe após sincronização')
    }

    console.log('✅ Sincronização completa da equipe finalizada')
    return teamData
  } catch (error) {
    console.error('❌ Erro na sincronização completa da equipe:', error)
    throw error
  }
}

/**
 * Atualizar membro da equipe
 */
export async function updateTeamMember(
  memberId: string, 
  updates: Partial<TeamMember>
): Promise<void> {
  try {
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, memberId)
    await updateDoc(memberRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    console.log('✅ Membro da equipe atualizado')
  } catch (error) {
    console.error('❌ Erro ao atualizar membro da equipe:', error)
    throw error
  }
}

/**
 * Adicionar novo membro à equipe
 */
export async function addTeamMember(member: Omit<TeamMember, 'id' | 'joinedAt' | 'updatedAt'>): Promise<string> {
  try {
    const memberId = member.name.toLowerCase().replace(/\s+/g, '-')
    const memberRef = doc(db, TEAM_MEMBERS_COLLECTION, memberId)
    
    const newMember: TeamMember = {
      ...member,
      id: memberId,
      joinedAt: new Date(),
      updatedAt: new Date()
    }

    await setDoc(memberRef, {
      ...newMember,
      joinedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    console.log('✅ Novo membro da equipe adicionado')
    return memberId
  } catch (error) {
    console.error('❌ Erro ao adicionar membro da equipe:', error)
    throw error
  }
}

// ============================================================================
// FUNÇÕES DE GERENCIAMENTO DE FUNCIONÁRIOS
// ============================================================================

/**
 * Buscar todos os funcionários
 */
export async function getEmployees(): Promise<Employee[]> {
  try {
    const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION))
    const employees = employeesSnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      lastLogin: doc.data().lastLogin?.toDate() || undefined
    })) as Employee[]

    return employees
  } catch (error) {
    console.error('❌ Erro ao buscar funcionários:', error)
    return []
  }
}

/**
 * Buscar funcionário por ID
 */
export async function getEmployeeById(employeeId: string): Promise<Employee | null> {
  try {
    const employeeDoc = await getDoc(doc(db, EMPLOYEES_COLLECTION, employeeId))
    
    if (!employeeDoc.exists()) {
      return null
    }

    const data = employeeDoc.data()
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate() || undefined
    } as Employee
  } catch (error) {
    console.error('❌ Erro ao buscar funcionário:', error)
    return null
  }
}

/**
 * Adicionar novo funcionário
 */
export async function addEmployee(employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  try {
    console.log('🔄 Iniciando adição de funcionário:', employee)
    
    // Validar dados obrigatórios
    if (!employee.username || !employee.email || !employee.password) {
      throw new Error('Dados obrigatórios não fornecidos')
    }
    
    const employeeId = employee.username.toLowerCase().replace(/\s+/g, '-')
    console.log('🔄 ID gerado:', employeeId)
    
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId)
    
    const newEmployee: Employee = {
      ...employee,
      id: employeeId,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('🔄 Dados do funcionário preparados:', newEmployee)
    console.log('🔄 Tentando salvar na coleção:', EMPLOYEES_COLLECTION)

    // Verificar se já existe
    const existingDoc = await getDoc(employeeRef)
    if (existingDoc.exists()) {
      throw new Error(`Funcionário com username '${employee.username}' já existe`)
    }

    // Salvar no Firebase com dados completos
    const employeeData = {
      id: employeeId,
      username: employee.username,
      email: employee.email,
      password: employee.password, // Em produção, deveria ser hasheada
      role: employee.role,
      isActive: employee.isActive,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    await setDoc(employeeRef, employeeData)

    console.log('✅ Funcionário salvo com sucesso no Firebase')
    console.log('✅ ID do funcionário:', employeeId)
    console.log('✅ Dados salvos:', employeeData)
    
    return employeeId
  } catch (error: any) {
    console.error('❌ Erro detalhado ao adicionar funcionário:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    
    // Logs específicos para diferentes tipos de erro
    if (error.code === 'permission-denied') {
      console.error('❌ Erro de permissão - Verificar regras do Firebase')
      throw new Error('Acesso negado. Verifique as regras de segurança do Firebase.')
    } else if (error.code === 'unavailable') {
      console.error('❌ Firebase indisponível')
      throw new Error('Firebase temporariamente indisponível. Tente novamente.')
    } else if (error.code === 'already-exists') {
      console.error('❌ Funcionário já existe')
      throw new Error('Um funcionário com este username já existe.')
    } else {
      console.error('❌ Erro desconhecido:', error)
      throw new Error(`Erro ao adicionar funcionário: ${error.message}`)
    }
  }
}

/**
 * Atualizar funcionário
 */
export async function updateEmployee(
  employeeId: string, 
  updates: Partial<Omit<Employee, 'id' | 'createdAt'>>
): Promise<void> {
  try {
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId)
    await updateDoc(employeeRef, {
      ...updates,
      updatedAt: serverTimestamp()
    })
    console.log('✅ Funcionário atualizado')
  } catch (error) {
    console.error('❌ Erro ao atualizar funcionário:', error)
    throw error
  }
}

/**
 * Excluir funcionário
 */
export async function deleteEmployee(employeeId: string): Promise<void> {
  try {
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId)
    await deleteDoc(employeeRef)
    console.log('✅ Funcionário excluído')
  } catch (error) {
    console.error('❌ Erro ao excluir funcionário:', error)
    throw error
  }
}

/**
 * Listener em tempo real para funcionários
 */
export function subscribeToEmployees(
  callback: (employees: Employee[]) => void
): () => void {
  const employeesRef = collection(db, EMPLOYEES_COLLECTION)

  const unsubscribe = onSnapshot(employeesRef, (snapshot) => {
    try {
      const employees = snapshot.docs.map(doc => ({
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate() || undefined
      })) as Employee[]

      callback(employees)
    } catch (error) {
      console.error('❌ Erro no listener de funcionários:', error)
      callback([])
    }
  })

  return unsubscribe
}

/**
 * Sincronizar funcionários iniciais
 */
export async function syncInitialEmployees(): Promise<void> {
  try {
    console.log('🔄 Verificando funcionários no Firebase...')
    const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION))
    
    console.log(`📊 Funcionários encontrados: ${employeesSnapshot.docs.length}`)
    
    // Limpar usuários online inativos
    await cleanupInactiveOnlineUsers()
    
    // Se não há funcionários, criar o usuário dev
    if (employeesSnapshot.empty) {
      console.log('🔄 Criando usuário dev inicial...')
      
      try {
        const devUser: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
          username: 'dev',
          email: 'dev@cdforge.dev',
          password: 'dev',
          role: 'dev',
          isActive: true
        }

        const employeeId = await addEmployee(devUser)
        console.log('✅ Usuário dev criado com sucesso!')
        console.log('📝 ID do usuário:', employeeId)
        console.log('📝 Credenciais: usuário = dev, senha = dev')
        
        // Verificar se foi criado
        const verifyDoc = await getDoc(doc(db, EMPLOYEES_COLLECTION, employeeId))
        if (verifyDoc.exists()) {
          console.log('✅ Usuário confirmado no Firebase:', verifyDoc.data())
        } else {
          console.log('❌ Usuário não encontrado após criação')
        }
        
      } catch (createError) {
        console.error('❌ Erro ao criar usuário dev:', createError)
        throw createError
      }
    } else {
      console.log(`✅ ${employeesSnapshot.docs.length} funcionários encontrados no Firebase`)
      employeesSnapshot.docs.forEach(doc => {
        const data = doc.data()
        console.log(`👤 Funcionário: ${data.username} (${data.role})`)
      })
    }
  } catch (error) {
    console.error('❌ Erro ao verificar/criar funcionários:', error)
    throw error
  }
}

/**
 * Validar credenciais com Firebase
 */
export async function validateEmployeeCredentials(username: string, password: string): Promise<Employee | null> {
  try {
    console.log('🔍 Validando credenciais:', { username, password })
    
    // Buscar em toda a coleção para maior compatibilidade
    console.log('🔍 Buscando na coleção employees...')
    const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION))
    
    console.log('🔍 Total de funcionários na coleção:', employeesSnapshot.docs.length)
    
    // Log de todos os funcionários para debug
    employeesSnapshot.docs.forEach(doc => {
      const data = doc.data()
      console.log('🔍 Funcionário na coleção:', {
        docId: doc.id,
        username: data.username,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
        password: data.password // Mostrar senha para debug
      })
    })
    
    const employee = employeesSnapshot.docs.find(doc => {
      const data = doc.data()
      
      // Verificação mais detalhada
      const usernameMatch = data.username === username
      const passwordMatch = data.password === password
      const isActive = data.isActive !== false // Considerar ativo se não for explicitamente false
      
      const matches = usernameMatch && passwordMatch && isActive
      
      console.log('🔍 Verificando:', {
        docId: doc.id,
        storedUsername: data.username,
        inputUsername: username,
        usernameMatch,
        storedPassword: data.password,
        inputPassword: password,
        passwordMatch,
        isActive: data.isActive,
        isActiveCheck: isActive,
        matches
      })
      
      return matches
    })

    if (employee) {
      const data = employee.data()
      console.log('✅ Funcionário encontrado:', data)
      
      // Atualizar último login
      try {
        const employeeRef = doc(db, EMPLOYEES_COLLECTION, employee.id)
        await updateDoc(employeeRef, {
          lastLogin: serverTimestamp()
        })
        console.log('✅ Último login atualizado')
      } catch (updateError) {
        console.warn('⚠️ Erro ao atualizar último login:', updateError)
      }
      
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate() || undefined
      } as Employee
    }

    console.log('❌ Nenhum funcionário encontrado com essas credenciais')
    return null
  } catch (error) {
    console.error('❌ Erro ao validar credenciais:', error)
    return null
  }
}

/**
 * Atualizar último login do funcionário
 */
export async function updateEmployeeLastLogin(employeeId: string): Promise<void> {
  try {
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId)
    await updateDoc(employeeRef, {
      lastLogin: serverTimestamp()
    })
  } catch (error) {
    console.error('❌ Erro ao atualizar último login:', error)
  }
}

/**
 * Limpar usuários online inativos (mais de 5 minutos sem atividade)
 */
export async function cleanupInactiveOnlineUsers(): Promise<void> {
  try {
    console.log('🧹 Limpando usuários online inativos...')
    
    const onlineUsersRef = collection(db, 'online_users')
    const onlineUsersSnapshot = await getDocs(onlineUsersRef)
    
    console.log(`📊 Usuários online encontrados: ${onlineUsersSnapshot.docs.length}`)
    
    // REMOVER COMPLETAMENTE todos os usuários online antigos (M7, Mllk, etc.)
    const deletePromises = onlineUsersSnapshot.docs.map(async (doc) => {
      const data = doc.data()
      console.log(`🗑️ Removendo completamente: ${data.username} (${data.id})`)
      
      // Deletar completamente o documento
      return deleteDoc(doc.ref)
    })
    
    await Promise.all(deletePromises)
    console.log('✅ Todos os usuários online antigos foram REMOVIDOS completamente')
  } catch (error) {
    console.error('❌ Erro ao limpar usuários inativos:', error)
  }
}

/**
 * Forçar criação do usuário dev (para debug)
 */
export async function forceCreateDevUser(): Promise<string> {
  try {
    console.log('🔄 Forçando criação do usuário dev...')
    
    const devUser: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
      username: 'dev',
      email: 'dev@cdforge.dev',
      password: 'dev',
      role: 'dev',
      isActive: true
    }

    const employeeId = await addEmployee(devUser)
    console.log('✅ Usuário dev criado forçadamente!')
    console.log('📝 ID:', employeeId)
    console.log('📝 Credenciais: dev / dev')
    
    return employeeId
  } catch (error) {
    console.error('❌ Erro ao forçar criação do usuário dev:', error)
    throw error
  }
}

/**
 * Sincronizar funcionários com Firebase
 */
export async function syncEmployeesToFirebase(): Promise<{ success: boolean; details: any }> {
  try {
    console.log('🔄 Iniciando sincronização com Firebase...')
    
    // Buscar funcionários atuais
    const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION))
    const currentEmployees = employeesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[]
    
    console.log('📊 Funcionários atuais no Firebase:', currentEmployees.length)
    
    // Verificar se há funcionários
    if (currentEmployees.length === 0) {
      console.log('⚠️ Nenhum funcionário encontrado, criando usuário dev padrão...')
      
      const devUser: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = {
        username: 'dev',
        email: 'dev@cdforge.dev',
        password: 'dev',
        role: 'dev',
        isActive: true
      }
      
      const devId = await addEmployee(devUser)
      console.log('✅ Usuário dev criado:', devId)
      
      return {
        success: true,
        details: {
          action: 'created_dev_user',
          totalEmployees: 1,
          createdUser: {
            id: devId,
            username: 'dev',
            role: 'dev'
          },
          message: 'Usuário dev criado com sucesso'
        }
      }
    }
    
    // Verificar integridade dos dados
    const validationResults = currentEmployees.map(emp => {
      const issues = []
      
      if (!emp.username) issues.push('username_missing')
      if (!emp.password) issues.push('password_missing')
      if (!emp.email) issues.push('email_missing')
      if (emp.isActive === undefined) issues.push('isActive_missing')
      if (!emp.role) issues.push('role_missing')
      
      return {
        id: emp.id,
        username: emp.username || 'sem_nome',
        issues,
        isValid: issues.length === 0
      }
    })
    
    const invalidEmployees = validationResults.filter(r => !r.isValid)
    const validEmployees = validationResults.filter(r => r.isValid)
    
    console.log('📊 Resultados da validação:', {
      total: currentEmployees.length,
      valid: validEmployees.length,
      invalid: invalidEmployees.length
    })
    
    // Corrigir funcionários inválidos
    let fixedCount = 0
    for (const invalid of invalidEmployees) {
      try {
        const employeeRef = doc(db, EMPLOYEES_COLLECTION, invalid.id)
        const updateData: any = {}
        
        if (invalid.issues.includes('isActive_missing')) {
          updateData.isActive = true
        }
        if (invalid.issues.includes('role_missing')) {
          updateData.role = 'funcionario'
        }
        
        if (Object.keys(updateData).length > 0) {
          await updateDoc(employeeRef, updateData)
          fixedCount++
          console.log(`✅ Funcionário ${invalid.username} corrigido`)
        }
      } catch (error) {
        console.error(`❌ Erro ao corrigir funcionário ${invalid.username}:`, error)
      }
    }
    
    return {
      success: true,
      details: {
        action: 'validated_and_fixed',
        totalEmployees: currentEmployees.length,
        validEmployees: validEmployees.length,
        invalidEmployees: invalidEmployees.length,
        fixedCount,
        validationResults,
        message: `Sincronização concluída. ${fixedCount} funcionários corrigidos.`
      }
    }
    
  } catch (error: any) {
    console.error('❌ Erro na sincronização:', error)
    return {
      success: false,
      details: {
        error: error.message,
        stack: error.stack
      }
    }
  }
}

/**
 * Testar login de funcionário (para debug)
 */
export async function testEmployeeLogin(username: string, password: string): Promise<{ success: boolean; details: any }> {
  try {
    console.log('🧪 Testando login:', { username, password })
    
    // Buscar funcionário
    const employeesSnapshot = await getDocs(collection(db, EMPLOYEES_COLLECTION))
    const employee = employeesSnapshot.docs.find(doc => {
      const data = doc.data()
      return data.username === username
    })
    
    if (!employee) {
      return {
        success: false,
        details: {
          error: 'Usuário não encontrado',
          totalEmployees: employeesSnapshot.docs.length,
          employees: employeesSnapshot.docs.map(doc => ({
            id: doc.id,
            username: doc.data().username,
            email: doc.data().email
          }))
        }
      }
    }
    
    const data = employee.data()
    const usernameMatch = data.username === username
    const passwordMatch = data.password === password
    const isActive = data.isActive !== false
    
    const success = usernameMatch && passwordMatch && isActive
    
    return {
      success,
      details: {
        employeeFound: true,
        employeeId: employee.id,
        storedData: {
          username: data.username,
          email: data.email,
          role: data.role,
          isActive: data.isActive,
          password: data.password
        },
        inputData: {
          username,
          password
        },
        checks: {
          usernameMatch,
          passwordMatch,
          isActive,
          finalResult: success
        }
      }
    }
  } catch (error: any) {
    return {
      success: false,
      details: {
        error: error.message,
        stack: error.stack
      }
    }
  }
}
