"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Shield, BarChart3, Package, DollarSign, Phone, Zap, LogOut, X, Users } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface DevNavigationProps {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
}

const navigationItems = [
  { icon: BarChart3, label: "Visão Geral", id: "overview" },
  { icon: Package, label: "Projetos/Pedidos", id: "projects" },
  { icon: DollarSign, label: "Planos e Preços", id: "pricing" },
  { icon: Phone, label: "Contatos", id: "contacts" },
  { icon: Zap, label: "Otimização", id: "optimization" },
  { icon: Users, label: "Funcionários", id: "employees" },
]

export function DevNavigation({ isOpen, onClose, activeSection, onSectionChange }: DevNavigationProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    onClose()
    // Redireciona para a página inicial do CDforge
    router.push('/')
  }

  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId)
    onClose() // Close mobile menu when section is selected
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-black/80 border-r border-red-600/20 backdrop-blur-sm z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-red-600/20 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Logo */}
        <div className="p-6 border-b border-red-600/20">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">CDforge</h2>
              <p className="text-red-400 text-sm">DEV Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-left transition-all duration-200 cursor-pointer", // Added cursor-pointer to navigation buttons
                  activeSection === item.id
                    ? "bg-red-600/20 text-white border border-red-600/30 shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-red-600/10 border border-transparent",
                )}
                onClick={() => handleSectionChange(item.id)}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-red-600/20">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-red-600 text-white text-sm">{user?.name?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.name || "Admin"}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email || "admin@cdforge.dev"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-red-600/10 transition-colors duration-200 cursor-pointer" // Added cursor-pointer to logout button
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </>
  )
}

