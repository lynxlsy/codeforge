"use client"

import { useEffect } from 'react'
import { GlobalSettingsService } from '@/lib/global-settings'

export function GlobalSettingsInitializer() {
  useEffect(() => {
    const globalSettingsService = GlobalSettingsService.getInstance()
    
    // Carregar configurações globais uma vez no início da aplicação
    globalSettingsService.loadGlobalSettings()
    
    return () => {
      globalSettingsService.cleanup()
    }
  }, [])

  // Componente invisível que apenas inicializa as configurações globais
  return null
}
