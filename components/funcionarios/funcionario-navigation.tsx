"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  UserCheck,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
  X,
  Bell,
  Search,
  Filter,
  Download,
  Activity,
  Calendar,
  Users,
  FileText,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useMobileFeatures } from "@/hooks/use-mobile"

interface FuncionarioNavigationProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigationItems = [
  { icon: CheckCircle, label: "Pedidos Aprovados", id: "approved", shortLabel: "Aprovados", badge: "3" },
  { icon: Clock, label: "Pedidos Pendentes", id: "pending", shortLabel: "Pendentes", badge: "2" },
  { icon: UserCheck, label: "Informações do Funcionário", id: "info", shortLabel: "Informações", badge: null },
]

export function FuncionarioNavigation({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
}: FuncionarioNavigationProps) {
  const { logout, user } = useAuth()
  const router = useRouter()
  const mobileFeatures = useMobileFeatures()
  const [searchTerm, setSearchTerm] = useState("")

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 bg-black/90 border-r border-blue-600/20 backdrop-blur-sm z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0 lg:z-auto
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-blue-600/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Funcionário</h2>
                <p className="text-blue-400 text-sm">{user?.username}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-blue-600/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-blue-600/20 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full justify-start h-12 px-4
                    ${isActive 
                      ? 'bg-blue-600/20 text-blue-400 border-blue-600/30' 
                      : 'text-gray-300 hover:bg-blue-600/10 hover:text-blue-400'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="outline" 
                      className={`
                        ml-2 text-xs
                        ${isActive 
                          ? 'border-blue-600/30 text-blue-400' 
                          : 'border-gray-600/30 text-gray-400'
                        }
                      `}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              )
            })}
          </nav>



          {/* User Actions */}
          <div className="p-4 border-t border-blue-600/20">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start border-red-600/20 text-red-400 hover:bg-red-600/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
