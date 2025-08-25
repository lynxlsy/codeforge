"use client"

import { useState } from "react"
import { DevNavigation } from "./dev-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Activity,
  Package,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Phone,
} from "lucide-react"
import { ProjectsManager } from "./projects-manager"
import { PricingManager } from "./pricing-manager"
import { ContactManager } from "./contact-manager"
import { IntelligentOptimizer } from "@/components/intelligent-optimizer"
import { useStats } from "@/hooks/use-firebase"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface DevDashboardProps {
  isModal?: boolean
  onClose?: () => void
  activeSection?: string
  onSectionChange?: (section: string) => void
}

const OverviewSection = () => {
  const { stats, loading, error, fetchStats } = useStats()
  const { logout, user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const handleRefresh = () => {
    fetchStats()
  }

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Visão Geral</h1>
          <p className="text-gray-400 text-xs sm:text-sm lg:text-base">Dashboard principal com estatísticas e métricas em tempo real</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-xs sm:text-sm">Logado como: <span className="text-red-400 font-medium">{user?.username}</span></span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-red-600/30 text-red-400 hover:bg-red-600/10 hover:text-red-300"
            >
              Sair
            </Button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-white hover:bg-red-600/10 rounded-lg transition-colors disabled:opacity-50"
            title="Atualizar estatísticas"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-400 text-xs sm:text-sm">Última atualização: {new Date().toLocaleString("pt-BR")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Pedidos Pendentes</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
          </CardHeader>
          <CardContent className="pb-2 sm:pb-4">
            {loading ? (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-400 mb-1">...</div>
            ) : error ? (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-400 mb-1">--</div>
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-400 mb-1">{stats?.pendingProjects || 0}</div>
            )}
            <div className="flex items-center text-xs text-gray-400">
              {loading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-400 mr-1"></div>
              ) : (
                <AlertTriangle className="h-3 w-3 text-orange-400 mr-1" />
              )}
              <span className="text-xs">pedidos aguardando</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Pedidos Aprovados</CardTitle>
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
          </CardHeader>
          <CardContent className="pb-2 sm:pb-4">
            {loading ? (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 mb-1">...</div>
            ) : error ? (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 mb-1">--</div>
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400 mb-1">{stats?.approvedProjects || 0}</div>
            )}
            <div className="flex items-center text-xs text-gray-400">
              {loading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400 mr-1"></div>
              ) : (
                <AlertTriangle className="h-3 w-3 text-green-400 mr-1" />
              )}
              <span className="text-xs">projetos aprovados</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Total de Projetos</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
          </CardHeader>
          <CardContent className="pb-2 sm:pb-4">
            {loading ? (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 mb-1">...</div>
            ) : error ? (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 mb-1">--</div>
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 mb-1">{stats?.totalProjects || 0}</div>
            )}
            <div className="flex items-center text-xs text-gray-400">
              {loading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-400 mr-1"></div>
              ) : (
                <AlertTriangle className="h-3 w-3 text-blue-400 mr-1" />
              )}
              <span className="text-xs">projetos cadastrados</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm hover:bg-black/40 transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-white">Contatos Ativos</CardTitle>
            <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
          </CardHeader>
          <CardContent className="pb-2 sm:pb-4">
            {loading ? (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400 mb-1">...</div>
            ) : error ? (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400 mb-1">--</div>
            ) : (
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400 mb-1">{stats?.activeContacts || 0}</div>
            )}
            <div className="flex items-center text-xs text-gray-400">
              {loading ? (
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-400 mr-1"></div>
              ) : (
                <AlertTriangle className="h-3 w-3 text-purple-400 mr-1" />
              )}
              <span className="text-xs">canais ativos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-red-400" />
                Atividades Recentes
              </div>
              <Badge variant="outline" className="border-orange-600/30 text-orange-400">
                {loading ? "Carregando..." : error ? "Erro" : "Em Tempo Real"}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
              ) : error ? (
                <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              ) : (
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              )}
              <p className="text-gray-400 text-lg font-medium mb-2">
                {loading ? "Carregando Atividades..." : error ? "Erro ao Carregar" : "Sistema Ativo"}
              </p>
              <p className="text-gray-500 text-sm">
                {loading 
                  ? "Buscando dados mais recentes..." 
                  : error 
                    ? "Não foi possível carregar as atividades" 
                    : "Os pedidos aparecem automaticamente quando confirmados"
                }
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center">
                <Package className="mr-2 h-5 w-5 text-red-400" />
                Pedidos Recentes
              </div>
              <Badge variant="outline" className="border-orange-600/30 text-orange-400">
                {loading ? "Carregando..." : error ? "Erro" : `${stats?.totalProjects || 0} Total`}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">Projetos mais recentes solicitados</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              {loading ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto mb-4"></div>
              ) : error ? (
                <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              ) : (
                <Package className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              )}
              <p className="text-gray-400 text-lg font-medium mb-2">
                {loading ? "Carregando Pedidos..." : error ? "Erro ao Carregar" : `${stats?.totalProjects || 0} Pedidos`}
              </p>
              <p className="text-gray-500 text-sm">
                {loading 
                  ? "Buscando pedidos mais recentes..." 
                  : error 
                    ? "Não foi possível carregar os pedidos" 
                    : `${stats?.pendingProjects || 0} pendentes, ${stats?.approvedProjects || 0} aprovados`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Package className="mr-2 h-5 w-5 text-red-400" />
            Ações Rápidas
          </CardTitle>
          <CardDescription className="text-gray-400">
            Funcionalidades disponíveis após sincronização com Firebase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col border-red-600/30 text-white hover:bg-red-600/10 bg-transparent"
              disabled
            >
              <Package className="h-6 w-6 mb-2 text-red-400" />
              <span className="text-xs">Novo Projeto</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col border-red-600/30 text-white hover:bg-red-600/10 bg-transparent"
              disabled
            >
              <DollarSign className="h-6 w-6 mb-2 text-green-400" />
              <span className="text-xs">Definir Preço</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col border-red-600/30 text-white hover:bg-red-600/10 bg-transparent"
              disabled
            >
              <Users className="h-6 w-6 mb-2 text-purple-400" />
              <span className="text-xs">Ver Clientes</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const ProjectsSection = () => <ProjectsManager />
const PricingSection = () => <PricingManager />
const ContactsSection = () => <ContactManager />
const OptimizationSection = () => <IntelligentOptimizer />

export function DevDashboard({ isModal = false, onClose, activeSection: initialActiveSection = "overview", onSectionChange }: DevDashboardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState(initialActiveSection)

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    onSectionChange?.(section)
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection />
      case "projects":
        return <ProjectsSection />
      case "pricing":
        return <PricingSection />
      case "contacts":
        return <ContactsSection />
      case "optimization":
        return <OptimizationSection />
      default:
        return <OverviewSection />
    }
  }

  return (
    <div className={`flex ${isModal ? 'h-full min-h-screen' : 'h-screen'}`}>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-black/50 border-red-600/20 text-white hover:bg-red-600/20"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Sidebar */}
      <DevNavigation
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main content */}
      <div className={`flex-1 lg:ml-64 p-2 sm:p-4 lg:p-8 overflow-y-auto ${isModal ? 'h-full min-h-screen' : ''}`}>
        <div className={`${isModal ? 'h-full min-h-screen' : 'max-w-7xl mx-auto'}`}>
          <div className={isModal ? "h-full min-h-screen" : "mt-12 lg:mt-0"}>{renderSectionContent()}</div>
        </div>
      </div>
    </div>
  )
}
