"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { DevLoginModal } from "./dev-login-modal"
import { useRouter } from "next/navigation"

interface DevModalManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function DevModalManager({ isOpen, onClose }: DevModalManagerProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  // Se estiver autenticado e o modal estiver aberto, redireciona para /dev
  useEffect(() => {
    if (isAuthenticated && isOpen && !loading) {
      router.push('/dev')
      onClose()
    }
  }, [isAuthenticated, isOpen, loading, router, onClose])

  // Se não estiver autenticado ou ainda estiver carregando, mostra o modal de login
  if (loading || !isAuthenticated) {
    return <DevLoginModal isOpen={isOpen} onClose={onClose} />
  }

  // Se estiver autenticado mas o modal não estiver aberto, não mostra nada
  return null
}
