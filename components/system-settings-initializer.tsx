"use client"

import { useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { SystemSettingsService } from '@/lib/system-settings'

export function SystemSettingsInitializer() {
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      // Inicializar configurações do sistema para o usuário
      const settingsService = SystemSettingsService.getInstance()
      settingsService.loadSettings(user.id)
        .then(() => {
          console.log('Configurações do sistema carregadas para:', user.id)
        })
        .catch((error) => {
          console.error('Erro ao carregar configurações do sistema:', error)
        })
    }

    // Cleanup quando o componente for desmontado
    return () => {
      const settingsService = SystemSettingsService.getInstance()
      settingsService.cleanup()
    }
  }, [user?.id])

  return null // Componente não renderiza nada
}
