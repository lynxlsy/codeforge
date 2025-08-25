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

interface DevLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DevLoginModal({ isOpen, onClose }: DevLoginModalProps) {
  const [user, setUser] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Usuários autorizados do sistema DEV (importados da configuração)
  const [authorizedUsers, setAuthorizedUsers] = useState<Array<{username: string, password: string}>>([])

  // Carregar usuários autorizados
  useEffect(() => {
    const loadAuthorizedUsers = async () => {
      try {
        const { getAuthorizedUsers } = await import('@/lib/dev-auth-config')
        const users = getAuthorizedUsers()
        setAuthorizedUsers(users.map(user => ({ username: user.username, password: user.password })))
      } catch (error) {
        console.error('Erro ao carregar usuários autorizados:', error)
      }
    }
    
    loadAuthorizedUsers()
  }, [])

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
      // Verificar se as credenciais estão na lista de usuários autorizados
      const isValidUser = authorizedUsers.some(
        authUser => authUser.username === user && authUser.password === password
      )

      console.log('🔐 Tentativa de login:', { user, password, isValidUser })

      if (isValidUser) {
        const success = await login(user, password)
        console.log('🔐 Resultado do login:', { user, success })
        
        if (success) {
          toast({
            title: "✅ Login realizado com sucesso!",
            description: `Bem-vindo, ${user}! Redirecionando para o painel administrativo...`,
          })
          onClose()
          // Limpar campos após login bem-sucedido
          setUser("")
          setPassword("")
          // Redireciona para /dev após login bem-sucedido
          router.push('/dev')
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
      <DialogContent className="w-[90vw] max-w-md mx-auto bg-black/95 border-red-600/20 backdrop-blur-sm">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-red-600 rounded-full w-fit">
            <Image
              src="/logo.svg"
              alt="CDforge Logo"
              width={32}
              height={32}
              className="w-8 h-8 filter brightness-0 invert"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">CDforge DEV</DialogTitle>
          <p className="text-gray-400 text-sm">Acesse o painel administrativo</p>
          <div className="mt-2 p-2 bg-red-600/10 border border-red-600/20 rounded-lg">
            <p className="text-xs text-red-400">
              🔒 Acesso restrito - Apenas usuários autorizados
            </p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user" className="text-white text-sm">
              User
            </Label>
            <Input
              id="user"
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Digite seu usuário"
              className="bg-black/50 border-red-600/20 text-white placeholder:text-gray-400 focus:border-red-600"
              required
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white text-sm">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="bg-black/50 border-red-600/20 text-white placeholder:text-gray-400 focus:border-red-600 pr-10"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>



        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </DialogContent>
    </Dialog>
  )
}
