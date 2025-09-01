'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Project, 
  getAllProjects, 
  getPendingProjects, 
  getProjectsByEmployee,
  assumeProject, 
  updateProjectStatus,
  deleteProject,
  deleteAllProjects,
  generateProjectReceipt,
  createSampleProjects,
  createProject
} from '@/lib/projects'
import { useAuth } from '@/contexts/auth-context'
import { 
  Briefcase, 
  User, 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  RefreshCw,
  Eye,
  Target,
  Trash2,
  Download,
  FileText,
  TestTube
} from 'lucide-react'

export function ProjectsManager() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [pendingProjects, setPendingProjects] = useState<Project[]>([])
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'my'>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const loadProjects = async () => {
    try {
      setLoading(true)
      const allProjects = await getAllProjects()
      const pending = await getPendingProjects()
      const my = user ? await getProjectsByEmployee(user.username) : []
      
      console.log('🔍 Projetos carregados:', allProjects.map(p => ({ id: p.id, title: p.title })))
      
      setProjects(allProjects)
      setPendingProjects(pending)
      setMyProjects(my)
    } catch (error) {
      console.error('❌ Erro ao carregar projetos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadProjects()
    setRefreshing(false)
  }

  const handleAssumeProject = async (projectId: string) => {
    console.log('🔍 handleAssumeProject chamado com projectId:', projectId)
    console.log('🔍 Tipo do projectId:', typeof projectId)
    
    if (!user) {
      alert('❌ Usuário não autenticado')
      return
    }

    if (!user.username) {
      alert('❌ Username do usuário não encontrado')
      return
    }

    // Validação rigorosa do projectId
    if (!projectId) {
      console.error('❌ projectId está undefined ou null')
      alert('❌ ID do projeto não encontrado')
      return
    }

    if (typeof projectId !== 'string') {
      console.error('❌ projectId não é uma string:', typeof projectId)
      alert('❌ ID do projeto inválido')
      return
    }

    if (projectId.trim() === '') {
      console.error('❌ projectId está vazio')
      alert('❌ ID do projeto está vazio')
      return
    }

    try {
      const employeeName = user.name || user.username || 'Usuário'
      console.log('🔍 Assumindo projeto:', { 
        projectId, 
        projectIdType: typeof projectId,
        projectIdLength: projectId.length,
        username: user.username, 
        name: employeeName 
      })
      
      await assumeProject(projectId, user.username, employeeName)
      await loadProjects()
      alert('✅ Projeto assumido com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro ao assumir projeto:', error)
      alert(`❌ Erro ao assumir projeto: ${error.message}`)
    }
  }

  const handleUpdateStatus = async (projectId: string, newStatus: Project['status']) => {
    try {
      await updateProjectStatus(projectId, newStatus)
      await loadProjects()
      alert('✅ Status atualizado com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro ao atualizar status:', error)
      alert(`❌ Erro ao atualizar status: ${error.message}`)
    }
  }

  const handleCreateSampleProjects = async () => {
    try {
      const confirmed = confirm('Criar projetos de exemplo?')
      if (!confirmed) return
      
      await createSampleProjects()
      await loadProjects()
      alert('✅ Projetos de exemplo criados com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro ao criar projetos de exemplo:', error)
      alert(`❌ Erro ao criar projetos: ${error.message}`)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const confirmed = confirm('Tem certeza que deseja excluir este projeto?')
      if (!confirmed) return
      
      await deleteProject(projectId)
      await loadProjects()
      alert('✅ Projeto excluído com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro ao excluir projeto:', error)
      alert(`❌ Erro ao excluir projeto: ${error.message}`)
    }
  }

  const handleDeleteAllProjects = async () => {
    try {
      const confirmed = confirm('⚠️ ATENÇÃO: Isso vai EXCLUIR TODOS os projetos!\n\nTem certeza absoluta?')
      if (!confirmed) return
      
      const confirmed2 = confirm('🚨 ÚLTIMA CHANCE: Todos os projetos serão PERDIDOS para sempre!\n\nCONFIRMA?')
      if (!confirmed2) return
      
      await deleteAllProjects()
      await loadProjects()
      alert('✅ Todos os projetos foram excluídos!')
    } catch (error: any) {
      console.error('❌ Erro ao excluir todos os projetos:', error)
      alert(`❌ Erro ao excluir projetos: ${error.message}`)
    }
  }

  const handleDownloadReceipt = async (project: Project) => {
    try {
      await generateProjectReceipt(project)
      alert('✅ Comprovante baixado com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro ao gerar comprovante:', error)
      alert(`❌ Erro ao gerar comprovante: ${error.message}`)
    }
  }

  const handleShowDetails = (project: Project) => {
    setSelectedProject(project)
    setShowDetailsModal(true)
  }

  useEffect(() => {
    loadProjects()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(loadProjects, 30000)
    return () => clearInterval(interval)
  }, []) // Removida dependência do user para evitar loop infinito

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500'
      case 'assigned': return 'bg-blue-500'
      case 'in_progress': return 'bg-orange-500'
      case 'completed': return 'bg-green-500'
      case 'cancelled': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusName = (status: Project['status']) => {
    switch (status) {
      case 'pending': return 'Pendente'
      case 'assigned': return 'Atribuído'
      case 'in_progress': return 'Em Andamento'
      case 'completed': return 'Concluído'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'bg-gray-500'
      case 'medium': return 'bg-blue-500'
      case 'high': return 'bg-orange-500'
      case 'urgent': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityName = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'Baixa'
      case 'medium': return 'Média'
      case 'high': return 'Alta'
      case 'urgent': return 'Urgente'
      default: return priority
    }
  }

  const formatCurrency = (value: number | undefined) => {
    if (!value || isNaN(value)) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Data não definida'
    try {
      return new Date(dateString).toLocaleDateString('pt-BR')
    } catch (error) {
      return 'Data inválida'
    }
  }

  const getDisplayProjects = () => {
    switch (filter) {
      case 'pending': return pendingProjects
      case 'my': return myProjects
      default: return projects
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Gerenciamento de Projetos
          </h2>
          <p className="text-gray-400">
            Visualize e gerencie todos os projetos e vendas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleDeleteAllProjects}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Todos
          </Button>
          
          <Button 
            onClick={handleCreateSampleProjects}
            className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-600/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Exemplos
          </Button>
          
          <Button 
            onClick={async () => {
              try {
                console.log('🔍 Testando criação de projeto único...')
                const projectId = await createProject({
                  title: 'Projeto Teste ID',
                  description: 'Teste para verificar se o ID está sendo gerado corretamente',
                  clientName: 'Cliente Teste',
                  clientEmail: 'teste@teste.com',
                  clientPhone: '(11) 11111-1111',
                  budget: 1000,
                  deadline: '2024-12-31',
                  category: 'Teste',
                  priority: 'medium',
                  requirements: ['Teste 1', 'Teste 2'],
                  status: 'pending'
                })
                console.log('✅ Projeto teste criado com ID:', projectId)
                await loadProjects()
                alert(`✅ Projeto teste criado com ID: ${projectId}`)
              } catch (error: any) {
                console.error('❌ Erro ao criar projeto teste:', error)
                alert(`❌ Erro: ${error.message}`)
              }
            }}
            className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-600/30"
          >
            <TestTube className="w-4 h-4 mr-2" />
            Teste ID
          </Button>
          
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-600/30"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600/50">
            <SelectValue />
          </SelectTrigger>
                                <SelectContent>
                        <SelectItem key="all" value="all">Todos os Projetos</SelectItem>
                        <SelectItem key="pending" value="pending">Pendentes</SelectItem>
                        <SelectItem key="my" value="my">Meus Projetos</SelectItem>
                      </SelectContent>
        </Select>
        
        <div className="text-sm text-gray-400">
          {filter === 'all' && `${projects.length} projetos`}
          {filter === 'pending' && `${pendingProjects.length} pendentes`}
          {filter === 'my' && `${myProjects.length} meus projetos`}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-600/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Total de Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{projects.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-600/10 to-yellow-800/10 border border-yellow-600/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-300">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{pendingProjects.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-600/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Em Andamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {projects.filter(p => p.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-600/20 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {projects.filter(p => p.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Projetos */}
      <Card className="bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-200">Projetos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <div className="text-gray-400">Carregando projetos...</div>
            </div>
          ) : getDisplayProjects().length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <div className="text-gray-400">Nenhum projeto encontrado</div>
              <Button 
                onClick={handleCreateSampleProjects}
                className="mt-4 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-600/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Projetos de Exemplo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {getDisplayProjects().map((project) => (
                <div 
                  key={project.id}
                  className="p-4 rounded-lg border border-gray-700/50 bg-gray-800/20 hover:bg-gray-800/30 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-200 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                        {getStatusName(project.status)}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(project.priority)}`}>
                        {getPriorityName(project.priority)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-400">
                      <User className="w-4 h-4 mr-2" />
                      {project.clientName}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {formatCurrency(project.budget)}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      Prazo: {formatDate(project.deadline)}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {project.category}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Criado em {project.createdAt.toLocaleDateString('pt-BR')}
                    </div>
                    
                                         <div className="flex gap-2">
                       <Button
                         onClick={() => handleShowDetails(project)}
                         size="sm"
                         className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-600/30"
                       >
                         <Eye className="w-3 h-3 mr-1" />
                         Detalhes
                       </Button>
                       
                       <Button
                         onClick={() => handleDownloadReceipt(project)}
                         size="sm"
                         className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-600/30"
                       >
                         <Download className="w-3 h-3 mr-1" />
                         Comprovante
                       </Button>
                       
                       {project.status === 'pending' && user && (
                         <Button
                           onClick={() => handleAssumeProject(project.id)}
                           size="sm"
                           className="bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-600/30"
                         >
                           <Target className="w-3 h-3 mr-1" />
                           Assumir Venda
                         </Button>
                       )}
                       
                       {project.status !== 'pending' && project.status !== 'completed' && (
                         <Select 
                           value={project.status} 
                           onValueChange={(value: any) => handleUpdateStatus(project.id, value)}
                         >
                           <SelectTrigger className="w-32 h-8 text-xs bg-gray-700/50 border-gray-600/50">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem key="assigned" value="assigned">Atribuído</SelectItem>
                             <SelectItem key="in_progress" value="in_progress">Em Andamento</SelectItem>
                             <SelectItem key="completed" value="completed">Concluído</SelectItem>
                             <SelectItem key="cancelled" value="cancelled">Cancelado</SelectItem>
                           </SelectContent>
                         </Select>
                       )}
                       
                       <Button
                         onClick={() => handleDeleteProject(project.id)}
                         size="sm"
                         className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30"
                       >
                         <Trash2 className="w-3 h-3 mr-1" />
                         Excluir
                       </Button>
                     </div>
                  </div>
                  
                  {project.assignedTo && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <div className="text-xs text-gray-400">
                        Atribuído para: <span className="text-blue-400">{project.assignedTo}</span>
                        {project.assignedAt && (
                          <span className="ml-2">
                            em {project.assignedAt ? project.assignedAt.toLocaleDateString('pt-BR') : 'Data não disponível'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
                 </CardContent>
       </Card>

       {/* Modal de Detalhes do Projeto */}
       <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
         <DialogContent className="bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 border border-gray-700/50 backdrop-blur-xl max-w-4xl max-h-[90vh] overflow-y-auto">
           <DialogHeader>
             <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
               Detalhes do Projeto
             </DialogTitle>
           </DialogHeader>
           
           {selectedProject && (
             <div className="space-y-6">
               {/* Informações do Projeto */}
               <div className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-600/20 rounded-lg p-4">
                 <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                   <FileText className="mr-2 h-5 w-5" />
                   Informações do Projeto
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <p className="text-sm text-gray-400">Título</p>
                     <p className="text-white font-medium">{selectedProject.title}</p>
                   </div>
                   
                   <div>
                     <p className="text-sm text-gray-400">Categoria</p>
                     <p className="text-white font-medium">{selectedProject.category}</p>
                   </div>
                   
                   <div>
                     <p className="text-sm text-gray-400">Status</p>
                     <Badge className={`${getStatusColor(selectedProject.status)}`}>
                       {getStatusName(selectedProject.status)}
                     </Badge>
                   </div>
                   
                   <div>
                     <p className="text-sm text-gray-400">Prioridade</p>
                     <Badge className={`${getPriorityColor(selectedProject.priority)}`}>
                       {getPriorityName(selectedProject.priority)}
                     </Badge>
                   </div>
                   
                   <div>
                     <p className="text-sm text-gray-400">Orçamento</p>
                     <p className="text-white font-medium">{formatCurrency(selectedProject.budget)}</p>
                   </div>
                   
                   <div>
                     <p className="text-sm text-gray-400">Prazo</p>
                     <p className="text-white font-medium">{formatDate(selectedProject.deadline)}</p>
                   </div>
                 </div>
                 
                 <div className="mt-4">
                   <p className="text-sm text-gray-400 mb-2">Descrição</p>
                                        <p className="text-white text-sm bg-gray-800/50 p-3 rounded-lg">
                       {selectedProject.description || 'Descrição não fornecida'}
                     </p>
                 </div>
                 
                 {selectedProject.requirements && selectedProject.requirements.length > 0 && (
                   <div className="mt-4">
                     <p className="text-sm text-gray-400 mb-2">Requisitos</p>
                     <div className="bg-gray-800/50 p-3 rounded-lg">
                       {selectedProject.requirements.map((req, index) => (
                         <div key={`req-${selectedProject.id}-${index}`} className="flex items-center text-white text-sm mb-1">
                           <span className="text-purple-400 mr-2">•</span>
                           {req || 'Requisito não especificado'}
                         </div>
                       ))}
                     </div>
                   </div>
                 )}
               </div>

               {/* Informações do Cliente */}
               <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-600/20 rounded-lg p-4">
                 <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
                   <User className="mr-2 h-5 w-5" />
                   Informações do Cliente
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <p className="text-sm text-gray-400">Nome</p>
                     <p className="text-white font-medium">{selectedProject.clientName || 'Não informado'}</p>
                   </div>
                   
                   <div>
                     <p className="text-sm text-gray-400">Email</p>
                     <p className="text-white font-medium">{selectedProject.clientEmail || 'Não informado'}</p>
                   </div>
                   
                   <div>
                     <p className="text-sm text-gray-400">Telefone</p>
                     <p className="text-white font-medium">{selectedProject.clientPhone || 'Não informado'}</p>
                   </div>
                   
                   <div>
                     <p className="text-sm text-gray-400">Data de Criação</p>
                     <p className="text-white font-medium">
                       {selectedProject.createdAt ? selectedProject.createdAt.toLocaleDateString('pt-BR') : 'Data não disponível'}
                     </p>
                   </div>
                 </div>
               </div>

               {/* Informações de Atribuição */}
               {selectedProject.assignedTo && (
                 <div className="bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-600/20 rounded-lg p-4">
                   <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center">
                     <Target className="mr-2 h-5 w-5" />
                     Informações de Atribuição
                   </h3>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <p className="text-sm text-gray-400">Atribuído para</p>
                       <p className="text-white font-medium">{selectedProject.assignedTo}</p>
                     </div>
                     
                     {selectedProject.assignedAt && (
                       <div>
                         <p className="text-sm text-gray-400">Data de Atribuição</p>
                         <p className="text-white font-medium">
                           {selectedProject.assignedAt ? selectedProject.assignedAt.toLocaleDateString('pt-BR') : 'Data não disponível'}
                         </p>
                       </div>
                     )}
                   </div>
                 </div>
               )}

               {/* Ações */}
               <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                 <div className="flex gap-2">
                   <Button
                     onClick={() => handleDownloadReceipt(selectedProject)}
                     className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-600/30"
                   >
                     <Download className="w-4 h-4 mr-2" />
                     Baixar Comprovante
                   </Button>
                   
                   {selectedProject.status === 'pending' && user && (
                     <Button
                       onClick={() => {
                         handleAssumeProject(selectedProject.id)
                         setShowDetailsModal(false)
                       }}
                       className="bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-600/30"
                     >
                       <Target className="w-4 h-4 mr-2" />
                       Assumir Venda
                     </Button>
                   )}
                 </div>
                 
                 <Button
                   onClick={() => setShowDetailsModal(false)}
                   className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 border border-gray-600/30"
                 >
                   Fechar
                 </Button>
               </div>
             </div>
           )}
         </DialogContent>
       </Dialog>
     </div>
   )
 }
