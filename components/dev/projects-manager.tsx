"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Check, Clock, CheckCircle, AlertCircle, XCircle, Loader, FolderOpen, RefreshCw, User, Mail, MessageCircle, Phone, Calendar, DollarSign, FileText, Settings, X } from "lucide-react"
import type { Project, ProjectFilter } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useProjects } from "@/hooks/use-firebase"

const statusConfig = {
  pending: { label: "Pendente", color: "bg-orange-400/20 text-orange-400 border-orange-400/30", icon: Clock },
  approved: { label: "Aprovado", color: "bg-green-400/20 text-green-400 border-green-400/30", icon: CheckCircle },
  in_progress: { label: "Em Desenvolvimento", color: "bg-blue-400/20 text-blue-400 border-blue-400/30", icon: Loader },
  completed: { label: "Concluído", color: "bg-purple-400/20 text-purple-400 border-purple-400/30", icon: Check },
  cancelled: { label: "Cancelado", color: "bg-red-400/20 text-red-400 border-red-400/30", icon: XCircle },
}

const platformConfig = {
  "discord-bot": { label: "Discord Bot", color: "bg-indigo-400/20 text-indigo-400" },
  "instagram-bot": { label: "Instagram Bot", color: "bg-pink-400/20 text-pink-400" },
  website: { label: "Website", color: "bg-blue-400/20 text-blue-400" },
  system: { label: "Sistema", color: "bg-green-400/20 text-green-400" },
  // Adicionar suporte para outras plataformas que podem vir do sistema de pricing
  discord: { label: "Discord Bot", color: "bg-indigo-400/20 text-indigo-400" },
  instagram: { label: "Instagram Bot", color: "bg-pink-400/20 text-pink-400" },
  whatsapp: { label: "WhatsApp Bot", color: "bg-green-400/20 text-green-400" },
  telegram: { label: "Telegram Bot", color: "bg-blue-400/20 text-blue-400" },
  custom: { label: "Sistema Customizado", color: "bg-purple-400/20 text-purple-400" },
  landing: { label: "Landing Page", color: "bg-blue-400/20 text-blue-400" },
  ecommerce: { label: "E-commerce", color: "bg-orange-400/20 text-orange-400" },
  portfolio: { label: "Portfólio", color: "bg-cyan-400/20 text-cyan-400" },
  corporate: { label: "Site Corporativo", color: "bg-gray-400/20 text-gray-400" },
  webapp: { label: "Aplicação Web", color: "bg-violet-400/20 text-violet-400" },
  api: { label: "API Personalizada", color: "bg-red-400/20 text-red-400" },
  integration: { label: "Integrações", color: "bg-yellow-400/20 text-yellow-400" },
  automation: { label: "Automação", color: "bg-emerald-400/20 text-emerald-400" },
  consulting: { label: "Consultoria", color: "bg-sky-400/20 text-sky-400" },
  maintenance: { label: "Manutenção", color: "bg-rose-400/20 text-rose-400" },
}

const complexityConfig = {
  basic: { label: "Básico", color: "bg-gray-400/20 text-gray-400" },
  intermediate: { label: "Intermediário", color: "bg-yellow-400/20 text-yellow-400" },
  advanced: { label: "Avançado", color: "bg-red-400/20 text-red-400" },
}

export function ProjectsManager() {
  const { projects, loading, error, updateProject, deleteProject: deleteProjectFromFirebase, fetchProjects } = useProjects()
  const [filters, setFilters] = useState<ProjectFilter>({
    status: "all",
    platform: "all",
    complexity: "all",
    search: "",
  })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { toast } = useToast()

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = filters.status === "all" || project.status === filters.status
    const matchesPlatform = filters.platform === "all" || project.platform === filters.platform
    const matchesComplexity = filters.complexity === "all" || project.complexity === filters.complexity
    const matchesSearch =
      filters.search === "" ||
      project.client.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.description.toLowerCase().includes(filters.search.toLowerCase())

    return matchesStatus && matchesPlatform && matchesComplexity && matchesSearch
  })

  const updateProjectStatus = async (projectId: string, newStatus: Project["status"]) => {
    try {
      await updateProject(projectId, { status: newStatus })
      toast({
        title: "Status atualizado",
        description: `Projeto atualizado para ${statusConfig[newStatus].label}`,
      })
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o status do projeto.",
        variant: "destructive",
      })
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      await deleteProjectFromFirebase(projectId)
      toast({
        title: "Projeto excluído",
        description: "O projeto foi removido com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o projeto.",
        variant: "destructive",
      })
    }
  }

  const saveProject = async (updatedProject: Project) => {
    try {
      await updateProject(updatedProject.id, updatedProject)
      setEditingProject(null)
      toast({
        title: "Projeto atualizado",
        description: "As alterações foram salvas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = () => {
    fetchProjects()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projetos e Pedidos</h1>
          <p className="text-gray-400">Gerencie todos os projetos solicitados pelos clientes</p>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader className="h-12 w-12 text-red-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Carregando projetos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projetos e Pedidos</h1>
          <p className="text-gray-400">Gerencie todos os projetos solicitados pelos clientes</p>
        </div>
        
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">Erro ao carregar projetos</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <button 
              onClick={handleRefresh}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Projetos e Pedidos</h1>
          <p className="text-gray-400">Gerencie todos os projetos solicitados pelos clientes</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-green-600/30 text-green-400">
            {projects.length} {projects.length === 1 ? 'projeto' : 'projetos'}
          </Badge>
          <button 
            onClick={handleRefresh}
            className="p-2 text-gray-400 hover:text-white hover:bg-red-600/10 rounded-lg transition-colors"
            title="Atualizar projetos"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Filter className="mr-2 h-5 w-5 text-red-400" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="search" className="text-white text-sm">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nome, email, descrição..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-10 bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status" className="text-white text-sm">Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
                <SelectTrigger className="bg-black/50 border-red-600/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="in_progress">Em Desenvolvimento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="platform" className="text-white text-sm">Plataforma</Label>
              <Select value={filters.platform} onValueChange={(value) => setFilters({ ...filters, platform: value })}>
                <SelectTrigger className="bg-black/50 border-red-600/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="discord-bot">Discord Bot</SelectItem>
                  <SelectItem value="instagram-bot">Instagram Bot</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="complexity" className="text-white text-sm">Complexidade</Label>
              <Select value={filters.complexity} onValueChange={(value) => setFilters({ ...filters, complexity: value })}>
                <SelectTrigger className="bg-black/50 border-red-600/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: "all", platform: "all", complexity: "all", search: "" })}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
          <CardContent className="flex items-center justify-center py-20">
            <div className="text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">Nenhum projeto encontrado</p>
              <p className="text-gray-500 text-sm">
                {projects.length === 0 
                  ? "Ainda não há projetos cadastrados. Os pedidos aparecerão aqui automaticamente."
                  : "Nenhum projeto corresponde aos filtros aplicados."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredProjects.map((project) => {
            const StatusIcon = statusConfig[project.status]?.icon || Clock
            const PlatformBadge = platformConfig[project.platform] || { label: project.platform, color: "bg-gray-400/20 text-gray-400" }
            const ComplexityBadge = complexityConfig[project.complexity] || { label: project.complexity, color: "bg-gray-400/20 text-gray-400" }

            return (
              <Card key={project.id} className="bg-black/30 border-red-600/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-white">{project.client}</h3>
                        <Badge className={statusConfig[project.status]?.color || "bg-gray-400/20 text-gray-400"}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[project.status]?.label || project.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="text-white">{project.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Plataforma</p>
                          <Badge className={PlatformBadge.color}>{PlatformBadge.label}</Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Complexidade</p>
                          <Badge className={ComplexityBadge.color}>{ComplexityBadge.label}</Badge>
                        </div>
                      <div>
                          <p className="text-sm text-gray-400">Valor</p>
                          <p className="text-white font-semibold">R$ {project.price.toLocaleString('pt-BR')}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-1">Descrição</p>
                        <p className="text-white text-sm line-clamp-2">{project.description}</p>
                      </div>

                      {project.features.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-2">Funcionalidades</p>
                          <div className="flex flex-wrap gap-1">
                            {project.features.slice(0, 3).map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs border-red-600/30 text-red-400">
                                {feature}
                              </Badge>
                            ))}
                            {project.features.length > 3 && (
                              <Badge variant="outline" className="text-xs border-gray-600/30 text-gray-400">
                                +{project.features.length - 3} mais
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                          Pedido em {new Date(project.date).toLocaleDateString('pt-BR')}
                        </div>
                        
                      <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                          >
                            Ver Detalhes
                          </button>
                          <button
                            onClick={() => setEditingProject(project)}
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
          </div>
        </CardContent>
      </Card>
            )
          })}
      </div>
      )}

      {/* Modal de Detalhes do Projeto */}
      <Dialog open={selectedProject !== null} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <FileText className="mr-2 h-5 w-5 text-red-400" />
              Detalhes do Projeto - {selectedProject?.client}
            </DialogTitle>
          </DialogHeader>
          
          {selectedProject && (
            <div className="space-y-6">
              {/* Informações do Cliente */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <User className="mr-2 h-4 w-4 text-blue-400" />
                  Informações do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Nome</p>
                      <p className="text-white font-medium">{selectedProject.client}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white font-medium">{selectedProject.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Método de Contato</p>
                      <Badge variant="outline" className="text-xs">
                        {selectedProject.contactMethod === 'email' ? 'Email' : 'WhatsApp'}
                      </Badge>
                    </div>
                  </div>
                  
                          <div className="flex items-center space-x-2">
          {selectedProject.contactMethod === 'email' ? (
            <Mail className="h-4 w-4 text-gray-400" />
          ) : (
            <MessageCircle className="h-4 w-4 text-gray-400" />
          )}
          <div>
            <p className="text-sm text-gray-400">
              Contato Principal ({selectedProject.contactMethod === 'email' ? 'E-mail' : 'WhatsApp'})
            </p>
            <p className="text-white font-medium">
              {selectedProject.email || 'Não informado'}
            </p>
          </div>
        </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Data do Pedido</p>
                      <p className="text-white font-medium">
                        {new Date(selectedProject.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedProject.notes && (
                  <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <p className="text-sm text-blue-300 font-medium mb-1">Observações</p>
                    <p className="text-blue-200 text-sm">{selectedProject.notes}</p>
                  </div>
                )}
              </div>

              <Separator className="bg-gray-700" />

              {/* Detalhes do Projeto */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <Settings className="mr-2 h-4 w-4 text-green-400" />
                  Detalhes do Projeto
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Plataforma</p>
                    <Badge className={platformConfig[selectedProject.platform]?.color || "bg-gray-400/20 text-gray-400"}>
                      {platformConfig[selectedProject.platform]?.label || selectedProject.platform}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Complexidade</p>
                    <Badge className={complexityConfig[selectedProject.complexity]?.color || "bg-gray-400/20 text-gray-400"}>
                      {complexityConfig[selectedProject.complexity]?.label || selectedProject.complexity}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Prazo Desejado</p>
                    <Badge variant="outline" className="text-xs">
                      {selectedProject.timeline === 'urgent' ? 'Urgente' :
                       selectedProject.timeline === 'normal' ? 'Normal' : 'Flexível'}
                    </Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Descrição Completa</p>
                  <div className="bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-white text-sm whitespace-pre-wrap">{selectedProject.description}</p>
                  </div>
                </div>

                {selectedProject.features.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Funcionalidades Solicitadas</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-red-600/30 text-red-400">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator className="bg-gray-700" />

              {/* Informações Financeiras */}
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center">
                  <DollarSign className="mr-2 h-4 w-4 text-yellow-400" />
                  Informações Financeiras
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Valor do Projeto</p>
                    <p className="text-white text-2xl font-bold">R$ {selectedProject.price.toLocaleString('pt-BR')}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status Atual</p>
                    <Badge className={statusConfig[selectedProject.status]?.color || "bg-gray-400/20 text-gray-400"}>
                      {(() => {
                        const StatusIcon = statusConfig[selectedProject.status]?.icon || Clock
                        return <StatusIcon className="h-3 w-3 mr-1" />
                      })()}
                      {statusConfig[selectedProject.status]?.label || selectedProject.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <Select
                    value={selectedProject.status}
                    onValueChange={(value) => updateProjectStatus(selectedProject.id, value as Project["status"])}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="in_progress">Em Desenvolvimento</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <X className="mr-2 h-4 w-4" />
                  Fechar
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Edição do Projeto */}
      <Dialog open={editingProject !== null} onOpenChange={(open) => !open && setEditingProject(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <Settings className="mr-2 h-5 w-5 text-yellow-400" />
              Editar Projeto - {editingProject?.client}
            </DialogTitle>
          </DialogHeader>
          
          {editingProject && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client" className="text-gray-300">Cliente</Label>
                  <Input
                    id="client"
                    value={editingProject.client}
                    onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    value={editingProject.email}
                    onChange={(e) => setEditingProject({ ...editingProject, email: e.target.value })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status" className="text-gray-300">Status</Label>
                  <Select
                    value={editingProject.status}
                    onValueChange={(value) => setEditingProject({ ...editingProject, status: value as Project["status"] })}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="approved">Aprovado</SelectItem>
                      <SelectItem value="in_progress">Em Desenvolvimento</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="price" className="text-gray-300">Preço</Label>
                  <Input
                    id="price"
                    type="number"
                    value={editingProject.price}
                    onChange={(e) => setEditingProject({ ...editingProject, price: Number(e.target.value) })}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-gray-300">Descrição</Label>
                <textarea
                  id="description"
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="w-full h-32 bg-gray-800 border border-gray-600 text-white rounded-md p-3 resize-none"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => saveProject(editingProject)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Salvar Alterações
                </button>
                
                <button
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
