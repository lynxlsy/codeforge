"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermission?: string
  adminOnly?: boolean
  fallbackPath?: string
}

export function ProtectedRoute({
  children,
  requiredPermission,
  adminOnly = false,
  fallbackPath = "/dev",
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(fallbackPath)
    }
  }, [isAuthenticated, loading, router, fallbackPath])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <CardTitle>Verificando Autenticação</CardTitle>
            <CardDescription>Aguarde um momento...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect via useEffect
  }

  // Check admin permission - for now, all authenticated users are considered admins
  if (adminOnly && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-destructive/10 rounded-full w-fit mb-4">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Acesso Negado</CardTitle>
            <CardDescription>
              Você não tem permissão para acessar esta área. Apenas administradores podem continuar.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Usuário atual: <span className="font-medium">{user?.name}</span> ({user?.email})
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check specific permission - for now, all authenticated users have all permissions
  if (requiredPermission && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto p-3 bg-destructive/10 rounded-full w-fit mb-4">
              <Shield className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Permissão Insuficiente</CardTitle>
            <CardDescription>
              Você não tem a permissão necessária ({requiredPermission}) para acessar esta funcionalidade.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Usuário atual: <span className="font-medium">{user?.name}</span> ({user?.email})
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
