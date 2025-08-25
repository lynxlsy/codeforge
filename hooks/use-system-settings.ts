import { useState, useEffect } from 'react'
import { SystemSettingsService, type SystemSettings } from '@/lib/system-settings'
import { useAuth } from '@/contexts/auth-context'

export function useSystemSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const settingsService = SystemSettingsService.getInstance()

  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const loadSettings = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const userSettings = await settingsService.loadSettings(user.id)
        setSettings(userSettings)
      } catch (err) {
        console.error('Erro ao carregar configurações:', err)
        setError('Erro ao carregar configurações')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()

    // Adicionar listener para mudanças em tempo real
    const unsubscribe = settingsService.addListener((newSettings) => {
      setSettings(newSettings)
    })

    return () => {
      unsubscribe()
    }
  }, [user?.id])

  const updateSetting = async <K extends keyof SystemSettings>(
    section: K,
    key: keyof SystemSettings[K],
    value: any
  ) => {
    if (!user?.id) return

    try {
      setError(null)
      await settingsService.updateSetting(section, key, value)
    } catch (err) {
      console.error('Erro ao atualizar configuração:', err)
      setError('Erro ao atualizar configuração')
      throw err
    }
  }

  const updateSection = async <K extends keyof SystemSettings>(
    section: K,
    values: Partial<SystemSettings[K]>
  ) => {
    if (!user?.id) return

    try {
      setError(null)
      await settingsService.updateSection(section, values)
    } catch (err) {
      console.error('Erro ao atualizar seção:', err)
      setError('Erro ao atualizar seção')
      throw err
    }
  }

  const resetToDefault = async () => {
    if (!user?.id) return

    try {
      setError(null)
      await settingsService.resetToDefault(user.id)
    } catch (err) {
      console.error('Erro ao resetar configurações:', err)
      setError('Erro ao resetar configurações')
      throw err
    }
  }

  const exportSettings = () => {
    return settingsService.exportSettings()
  }

  const importSettings = async (jsonString: string) => {
    if (!user?.id) return

    try {
      setError(null)
      await settingsService.importSettings(jsonString, user.id)
    } catch (err) {
      console.error('Erro ao importar configurações:', err)
      setError('Erro ao importar configurações')
      throw err
    }
  }

  return {
    settings,
    loading,
    error,
    updateSetting,
    updateSection,
    resetToDefault,
    exportSettings,
    importSettings
  }
}
