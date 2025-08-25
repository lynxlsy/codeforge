import { useState, useEffect } from 'react'
import { GlobalSettingsService, GlobalSettings } from '@/lib/global-settings'

export function useGlobalSettings() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const globalSettingsService = GlobalSettingsService.getInstance()

    const loadSettings = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Carregar configurações globais
        const globalSettings = await globalSettingsService.loadGlobalSettings()
        setSettings(globalSettings)
        
        // Adicionar listener para mudanças em tempo real
        const unsubscribe = globalSettingsService.addListener((newSettings) => {
          console.log('🌍 Configurações globais atualizadas em tempo real:', newSettings)
          setSettings(newSettings)
        })

        return unsubscribe
      } catch (err) {
        console.error('Erro ao carregar configurações globais:', err)
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    const unsubscribe = loadSettings()

    return () => {
      if (unsubscribe) {
        unsubscribe.then(unsub => unsub())
      }
      globalSettingsService.cleanup()
    }
  }, [])

  const updateGlobalSetting = async <K extends keyof GlobalSettings>(
    section: K,
    key: keyof GlobalSettings[K],
    value: any,
    updatedBy: string = 'system'
  ) => {
    try {
      const globalSettingsService = GlobalSettingsService.getInstance()
      await globalSettingsService.updateGlobalSetting(section, key, value, updatedBy)
    } catch (err) {
      console.error('Erro ao atualizar configuração global:', err)
      throw err
    }
  }

  const updateGlobalSection = async <K extends keyof GlobalSettings>(
    section: K,
    values: Partial<GlobalSettings[K]>,
    updatedBy: string = 'system'
  ) => {
    try {
      const globalSettingsService = GlobalSettingsService.getInstance()
      await globalSettingsService.updateGlobalSection(section, values, updatedBy)
    } catch (err) {
      console.error('Erro ao atualizar seção global:', err)
      throw err
    }
  }

  const resetToDefault = async (updatedBy: string = 'system') => {
    try {
      const globalSettingsService = GlobalSettingsService.getInstance()
      await globalSettingsService.resetToDefault(updatedBy)
    } catch (err) {
      console.error('Erro ao resetar configurações globais:', err)
      throw err
    }
  }

  return {
    settings,
    loading,
    error,
    updateGlobalSetting,
    updateGlobalSection,
    resetToDefault
  }
}
