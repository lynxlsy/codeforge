
"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Shield, X, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { isDevUser, isFuncionario, debugLogin, hasDevAccess } from "@/lib/dev-auth-config"

interface DevLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DevLoginModal({ isOpen, onClose }: DevLoginModalProps) {
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated, user: authUser } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Fechar modal automaticamente se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated && authUser && isOpen) {
      console.log('✅ Usuário já autenticado, fechando modal:', authUser.username)
      onClose()
    }
  }, [isAuthenticated, authUser, isOpen, onClose])

  // Login direto do código fonte - sem Firebase

  // Limpar campos quando o modal for fechado
  const handleClose = () => {
    setUser("")
    setPassword("")
    setShowPassword(false)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Debug do login
      debugLogin(user, password)
      
      // IMPORTANTE: Login direto do código fonte, SEM Firebase
      const { validateCredentials } = await import('@/lib/dev-auth-config')
      const validUser = validateCredentials(user, password)
      
      console.log('🔐 Tentativa de login:', { user, password, validUser })

      if (validUser) {
        // Login direto - sem Firebase
        const success = await login(user, password)
        console.log('🔐 Resultado do login:', { user, success })
        
        if (success) {
          // Determinar para qual área redirecionar baseado no tipo de usuário
          let redirectPath = '/dev'
          let userType = 'Desenvolvedor'
          
          console.log('🔍 Verificando tipo de usuário:', { username: user, validUser })
          
          const isDev = isDevUser(user)
          const isFunc = isFuncionario(user)
          
          console.log('🔍 Resultado das verificações:', { isDev, isFunc })
          
          if (hasDevAccess(user)) {
            redirectPath = '/dev'
            userType = 'Desenvolvedor'
          } else if (isFunc) {
            redirectPath = '/funcionarios'
            userType = 'Funcionário'
          } else {
            // Usuário não tem acesso à área DEV
            toast({
              title: "❌ Acesso Negado",
              description: "Apenas o usuário 'Dev' tem acesso à área de desenvolvimento.",
              variant: "destructive"
            })
            return
          }

          console.log('🔍 Redirecionando para:', { redirectPath, userType })

          toast({
            title: "✅ Login realizado com sucesso!",
            description: `Bem-vindo, ${user}! Redirecionando para a área de ${userType}...`,
          })
          onClose()
          // Limpar campos após login bem-sucedido
          setUser("")
          setPassword("")
          // Redireciona para a área apropriada
          router.push(redirectPath)
        } else {
          toast({
            title: "❌ Erro no sistema de autenticação",
            description: "Tente novamente ou entre em contato com o administrador.",
            variant: "destructive",
          })
        }
      } else {
        console.log('🔐 Usuário não autorizado:', { user, password })
        toast({
          title: "❌ Acesso negado",
          description: "Usuário ou senha incorretos. Tente novamente.",
          variant: "destructive",
        })
        // Limpar senha em caso de erro
        setPassword("")
      }
    } catch (error) {
      toast({
        title: "❌ Erro ao fazer login",
        description: "Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-gradient-to-br from-gray-900/95 via-black/95 to-gray-900/95 border border-gray-700/50 backdrop-blur-xl p-6 sm:p-8 shadow-2xl" showCloseButton={false}>
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-full w-fit shadow-lg">
            <Image
              src="/logo.svg"
              alt="CDforge Logo"
              width={32}
              height={32}
              className="w-8 h-8 filter brightness-0 invert"
            />
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            CDforge Acesso
          </DialogTitle>
          <p className="text-gray-400 text-sm">Painel administrativo e gerenciamento</p>
          <div className="mt-3 p-3 bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-300 font-medium">
              🔒 Acesso restrito - Apenas usuário Dev
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user" className="text-gray-200 text-sm font-medium">
              Usuário
            </Label>
            <Input
              id="user"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Digite seu usuário"
              className="bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500/20 text-sm h-12 transition-all duration-200"
              required
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200 text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="bg-gray-800/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500/20 pr-12 text-sm h-12 transition-all duration-200"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-2 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-12 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Entrando...
              </>
            ) : (
              "Entrar no Sistema"
            )}
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={() => {
                console.log('🔍 DEBUG: Testando login dev/D')
                debugLogin('dev', 'D')
                alert('🔍 Debug Dev executado! Verifique o console.')
              }}
              className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border border-yellow-600/30 h-10 text-xs font-medium transition-all duration-200"
            >
              🔍 Debug Dev
            </Button>
            
            <Button
              type="button"
              onClick={() => {
                console.log('🔍 DEBUG: Testando login melke/M7')
                debugLogin('melke', 'M7')
                alert('🔍 Debug Melke executado! Verifique o console.')
              }}
              className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-600/30 h-10 text-xs font-medium transition-all duration-200"
            >
              🔍 Debug Melke
            </Button>
          </div>
        </form>

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors p-1"
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      </DialogContent>
    </Dialog>
  )
}
