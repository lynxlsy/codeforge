"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DevLoginModal } from "./dev-login-modal"
import { useRouter } from "next/navigation"
import { isDevUser, isFuncionario } from "@/lib/dev-auth-config"

interface DevModalManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function DevModalManager({ isOpen, onClose }: DevModalManagerProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const router = useRouter()

  // Se estiver autenticado e o modal estiver aberto, redireciona para a área apropriada
  useEffect(() => {
    if (isAuthenticated && isOpen && !loading && user) {
      let redirectPath = '/dev'
      
      if (isDevUser(user.username)) {
        redirectPath = '/dev'
      } else if (isFuncionario(user.username)) {
        redirectPath = '/funcionarios'
      }
      
      router.push(redirectPath)
      onClose()
    }
  }, [isAuthenticated, isOpen, loading, router, onClose, user])

  // Se não estiver autenticado ou ainda estiver carregando, mostra o modal de login
  if (loading || !isAuthenticated) {
    return <DevLoginModal isOpen={isOpen} onClose={onClose} />
  }

  // Se estiver autenticado mas o modal não estiver aberto, não mostra nada
  return null
}
