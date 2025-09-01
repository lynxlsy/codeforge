"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DevLoginModal } from "@/components/dev/dev-login-modal"
import { Loader2, Shield, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProtectedDevRouteProps {
  children: React.ReactNode
}

export function ProtectedDevRoute({ children }: ProtectedDevRouteProps) {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  // Verificar autenticação apenas uma vez ao montar o componente
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await checkAuthStatus()
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
      } finally {
        setAuthChecked(true)
      }
    }

    verifyAuth()
  }, [checkAuthStatus])

  // Removida verificação periódica para evitar problemas de sessão

  // Mostrar modal de login se não estiver autenticado
  useEffect(() => {
    if (authChecked && !loading && !isAuthenticated) {
      setShowLoginModal(true)
    }
  }, [authChecked, loading, isAuthenticated])

  // Redirecionar se tentar fechar o modal sem estar autenticado
  const handleCloseModal = () => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }

  // Se ainda está carregando, mostrar loading
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto p-4 bg-red-600 rounded-full w-fit">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-red-600 mx-auto" />
            <p className="text-white text-sm">Verificando autenticação...</p>
          </div>
        </div>
      </div>
    )
  }

  // Se não está autenticado, mostrar modal de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="mx-auto p-4 bg-red-600 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-white text-xl font-bold">Acesso Restrito</h1>
            <p className="text-gray-400 text-sm">Esta área requer autenticação DEV</p>
          </div>
        </div>
        
        <DevLoginModal 
          isOpen={showLoginModal} 
          onClose={handleCloseModal}
        />
      </div>
    )
  }

  // Se está autenticado, mostrar o conteúdo protegido
  return (
    <>
      {children}
      
      {/* Modal de login sempre disponível para reautenticação */}
      <DevLoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}
