"use client"

import { useState, useEffect } from "react"
import { ParticlesBackground } from "@/components/particles-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Users,
  Package,
  Target,
  Download,
  LogOut,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { ProtectedFuncionarioRoute } from "@/components/auth/protected-funcionario-route"
import { getPredefinedEmployeesFromFirebase, getOnlineEmployees } from "@/lib/predefined-employees"
import { getAllProjects, Project, assumeProject, generateProjectReceipt } from "@/lib/projects"

export default function FuncionariosPage() {
  return (
    <ProtectedFuncionarioRoute>
      <FuncionariosContent />
    </ProtectedFuncionarioRoute>
  )
}

function FuncionariosContent() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [employees, setEmployees] = useState<any[]>([])
  const [onlineEmployees, setOnlineEmployees] = useState<any[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("projects")

  const loadData = async () => {
    try {
      setLoading(true)
      const allEmployees = await getPredefinedEmployeesFromFirebase()
      const online = await getOnlineEmployees()
      const allProjects = await getAllProjects()
      
      setEmployees(allEmployees)
      setOnlineEmployees(online)
      setProjects(allProjects)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleAssumeProject = async (projectId: string) => {
    if (!user?.username) {
      alert('❌ Usuário não autenticado')
      return
    }

    try {
      const employeeName = user.name || user.username
      await assumeProject(projectId, user.username, employeeName)
      await loadData()
      alert('✅ Projeto assumido com sucesso!')
    } catch (error: any) {
      alert(`❌ Erro ao assumir projeto: ${error.message}`)
    }
  }

  const handleDownloadReceipt = async (project: Project) => {
    try {
      await generateProjectReceipt(project)
      alert('✅ Comprovante baixado com sucesso!')
    } catch (error: any) {
      alert(`❌ Erro ao gerar comprovante: ${error.message}`)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'assigned': return 'bg-yellow-500'
      case 'pending': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusName = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluído'
      case 'in_progress': return 'Em Andamento'
      case 'assigned': return 'Atribuído'
      case 'pending': return 'Pendente'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <ParticlesBackground particleCount={30} />

      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-xl border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Área do Funcionário
              </h1>
              <p className="text-xs text-blue-400 hidden sm:block">Dashboard e gerenciamento</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="flex-1 sm:flex-none border-blue-600/30 text-blue-400 hover:bg-blue-600/10 hover:text-blue-300"
            >
              <RefreshCw className={`w-4 h-4 mr-1 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
              <span className="sm:hidden">Atual</span>
            </Button>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-red-600/30 text-red-400 hover:bg-red-600/10 hover:text-red-300"
            >
              <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
              <span className="sm:hidden">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-600/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Total de Funcionários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{employees.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-600/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-300">Online</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{onlineEmployees.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-600/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Total de Projetos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{projects.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-600/10 to-yellow-800/10 border border-yellow-600/20 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-300">Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {projects.filter(p => p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Desktop Tabs */}
          <TabsList className="hidden md:grid md:grid-cols-2 w-full bg-gray-800/50 border border-gray-700/50">
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-300">
              <Package className="w-4 h-4 mr-2" />
              Projetos
            </TabsTrigger>
            <TabsTrigger value="employees" className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-300">
              <Users className="w-4 h-4 mr-2" />
              Funcionários
            </TabsTrigger>
          </TabsList>

          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <div className="relative">
              <select 
                value={activeTab}
                className="w-full bg-gradient-to-r from-gray-800/80 to-gray-900/80 border border-gray-600/50 text-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 appearance-none cursor-pointer shadow-lg backdrop-blur-sm"
                onChange={(e) => setActiveTab(e.target.value)}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 2.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '4rem'
                }}
              >
                <option value="projects" className="bg-gray-800 text-gray-200 py-2">📦 Projetos</option>
                <option value="employees" className="bg-gray-800 text-gray-200 py-2">👥 Funcionários</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Tab Projetos */}
          <TabsContent value="projects" className="space-y-4">
            <Card className="bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-200 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-purple-400" />
                  Projetos e Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <div className="text-gray-400">Carregando projetos...</div>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <div className="text-gray-400">Nenhum projeto encontrado</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {projects.map((project) => (
                      <div 
                        key={project.id}
                        className="relative p-4 md:p-6 rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/20 to-gray-900/20 hover:border-purple-600/30 hover:shadow-lg hover:shadow-purple-600/10 transition-all duration-300 backdrop-blur-sm"
                      >
                        {/* Header com ícone e status */}
                        <div className="flex items-start justify-between mb-4 md:mb-6">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Package className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-200 text-sm md:text-lg truncate">{project.title || 'Título não definido'}</div>
                              <div className="text-xs md:text-sm text-gray-400 truncate">{project.clientName || 'Cliente não definido'}</div>
                            </div>
                          </div>
                          <Badge className={`text-xs md:text-sm px-2 py-1 md:px-3 md:py-2 ml-2 flex-shrink-0 ${getStatusColor(project.status)}`}>
                            {getStatusName(project.status)}
                          </Badge>
                        </div>
                        
                        {/* Informações do projeto */}
                        <div className="space-y-2 md:space-y-4 mb-4 md:mb-6">
                          <div className="flex items-center justify-between p-2 md:p-3 bg-gray-800/30 rounded-lg">
                            <span className="text-xs md:text-sm text-gray-400">Orçamento:</span>
                            <span className="text-xs md:text-sm font-medium text-gray-200">R$ {project.budget?.toLocaleString('pt-BR') || '0'}</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-2 md:p-3 bg-gray-800/30 rounded-lg">
                            <span className="text-xs md:text-sm text-gray-400">Categoria:</span>
                            <span className="text-xs md:text-sm text-gray-300 truncate">{project.category || 'Categoria não definida'}</span>
                          </div>
                          
                          {project.assignedTo && (
                            <div className="flex items-center justify-between p-2 md:p-3 bg-blue-900/20 rounded-lg border border-blue-600/20">
                              <span className="text-xs md:text-sm text-gray-400">Atribuído para:</span>
                              <span className="text-xs md:text-sm font-medium text-blue-400">{project.assignedTo}</span>
                            </div>
                          )}
                        </div>
                        
                                                 {/* Botões de Ação */}
                         <div className="flex flex-wrap gap-2 md:gap-3 pt-4 md:pt-5 border-t border-gray-700/50">
                           {project.status === 'pending' && (
                             <Button
                               onClick={() => handleAssumeProject(project.id)}
                               size="sm"
                               className="flex-1 min-w-0 bg-gradient-to-r from-orange-600/20 to-orange-700/20 hover:from-orange-600/30 hover:to-orange-700/30 text-orange-300 border border-orange-600/30 text-xs md:text-sm font-medium transition-all duration-200 h-9 md:h-10 px-3 md:px-4"
                             >
                               <Target className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
                               <span className="truncate">Assumir</span>
                             </Button>
                           )}
                           
                           <Button
                             onClick={() => handleDownloadReceipt(project)}
                             size="sm"
                             className="flex-1 min-w-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 text-blue-300 border border-blue-600/30 text-xs md:text-sm font-medium transition-all duration-200 h-9 md:h-10 px-3 md:px-4"
                           >
                             <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 flex-shrink-0" />
                             <span className="truncate">Comprovante</span>
                           </Button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Funcionários */}
          <TabsContent value="employees" className="space-y-4">
            <Card className="bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-200 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-400" />
                  Funcionários
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <div className="text-gray-400">Carregando funcionários...</div>
                  </div>
                ) : employees.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <div className="text-gray-400">Nenhum funcionário encontrado</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {employees.map((employee) => {
                      const isOnline = onlineEmployees.some(online => online.username === employee.username)
                      
                      return (
                        <div 
                          key={employee.username}
                          className={`p-4 rounded-lg border transition-all duration-200 ${
                            isOnline 
                              ? 'bg-green-600/10 border-green-600/30' 
                              : 'bg-gray-800/20 border-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              isOnline ? 'bg-green-600/20' : 'bg-gray-700/50'
                            }`}>
                              <User className={`w-5 h-5 ${isOnline ? 'text-green-400' : 'text-gray-400'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-200">{employee.name}</div>
                              <div className="text-sm text-gray-400">{employee.username}</div>
                            </div>
                            {isOnline && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">Cargo:</span>
                              <Badge className={`text-xs ${employee.role === 'dev' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                {employee.role === 'dev' ? 'Desenvolvedor' : 'Funcionário'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-400">Status:</span>
                              <Badge className={`text-xs ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}>
                                {isOnline ? '🟢 Online' : '⚫ Offline'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

