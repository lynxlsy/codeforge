"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { isFuncionario } from "@/lib/dev-auth-config"

interface ProtectedFuncionarioRouteProps {
  children: React.ReactNode
  fallbackPath?: string
}

export function ProtectedFuncionarioRoute({
  children,
  fallbackPath = "/",
}: ProtectedFuncionarioRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(fallbackPath)
    }
  }, [isAuthenticated, loading, router, fallbackPath])

  useEffect(() => {
    if (!loading && isAuthenticated && user && !isFuncionario(user.username)) {
      router.push('/dev')
    }
  }, [loading, isAuthenticated, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900/10 via-background to-blue-600/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-blue-600/10 rounded-full w-fit mb-4">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Verificando Acesso</CardTitle>
            <CardDescription>Aguarde um momento...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  // Verificar se o usuário é um funcionário
  if (user && !isFuncionario(user.username)) {
    return null // Will redirect via useEffect
  }

  return <>{children}</>
}

