import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

export interface SystemSettings {
  // Configurações de Performance
  performance: {
    enableOptimization: boolean
    autoOptimize: boolean
    imageCompression: boolean
    lazyLoading: boolean
    cacheStrategy: 'aggressive' | 'balanced' | 'minimal'
    cleanMode: boolean
    disableParticles: boolean
    disableAnimations: boolean
    reduceMotion: boolean
    minimalUI: boolean
  }
  
  // Configurações de UI
  ui: {
    sidebarCollapsed: boolean
    theme: 'dark' | 'light' | 'auto'
    animations: boolean
    reducedMotion: boolean
    fontSize: 'small' | 'medium' | 'large'
  }
  
  // Configurações de Notificações
  notifications: {
    enabled: boolean
    sound: boolean
    desktop: boolean
    email: boolean
    whatsapp: boolean
  }
  
  // Configurações de Segurança
  security: {
    sessionTimeout: number // em minutos
    requireReauth: boolean
    maxSessions: number
    deviceTracking: boolean
  }
  
  // Configurações de Backup
  backup: {
    autoBackup: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
    cloudBackup: boolean
    localBackup: boolean
  }
  
  // Metadados
  lastUpdated: string
  version: string
  userId: string
}

const DEFAULT_SETTINGS: SystemSettings = {
  performance: {
    enableOptimization: true,
    autoOptimize: true,
    imageCompression: true,
    lazyLoading: true,
    cacheStrategy: 'balanced',
    cleanMode: false,
    disableParticles: false,
    disableAnimations: false,
    reduceMotion: false,
    minimalUI: false
  },
  ui: {
    sidebarCollapsed: false,
    theme: 'dark',
    animations: true,
    reducedMotion: false,
    fontSize: 'medium'
  },
  notifications: {
    enabled: true,
    sound: true,
    desktop: true,
    email: false,
    whatsapp: false
  },
  security: {
    sessionTimeout: 1440, // 24 horas
    requireReauth: false,
    maxSessions: 5,
    deviceTracking: true
  },
  backup: {
    autoBackup: true,
    backupFrequency: 'weekly',
    cloudBackup: true,
    localBackup: false
  },
  lastUpdated: new Date().toISOString(),
  version: '1.0.0',
  userId: ''
}

class SystemSettingsService {
  private static instance: SystemSettingsService
  private settings: SystemSettings = DEFAULT_SETTINGS
  private listeners: ((settings: SystemSettings) => void)[] = []
  private unsubscribe: (() => void) | null = null

  static getInstance(): SystemSettingsService {
    if (!SystemSettingsService.instance) {
      SystemSettingsService.instance = new SystemSettingsService()
    }
    return SystemSettingsService.instance
  }

  // Carregar configurações do Firebase
  async loadSettings(userId: string): Promise<SystemSettings> {
    try {
      const settingsRef = doc(db, 'system-settings', userId)
      
      // Configurar listener em tempo real
      this.unsubscribe = onSnapshot(settingsRef, async (doc) => {
        if (doc.exists()) {
          const data = doc.data() as SystemSettings
          this.settings = { ...DEFAULT_SETTINGS, ...data, userId }
          this.notifyListeners()
        } else {
          // Criar configurações padrão
          const defaultSettings = { ...DEFAULT_SETTINGS, userId }
          this.settings = defaultSettings
          await this.saveSettings(defaultSettings)
          this.notifyListeners()
        }
      }, (error) => {
        console.error('Erro ao carregar configurações:', error)
        // Usar configurações padrão em caso de erro
        this.settings = { ...DEFAULT_SETTINGS, userId }
        this.notifyListeners()
      })

      return this.settings
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
      this.settings = { ...DEFAULT_SETTINGS, userId }
      return this.settings
    }
  }

  // Salvar configurações no Firebase
  async saveSettings(settings: Partial<SystemSettings>): Promise<void> {
    try {
      const updatedSettings = {
        ...this.settings,
        ...settings,
        lastUpdated: new Date().toISOString()
      }

      const settingsRef = doc(db, 'system-settings', updatedSettings.userId)
      await setDoc(settingsRef, updatedSettings, { merge: true })
      
      this.settings = updatedSettings
      this.notifyListeners()
    } catch (error) {
      console.error('Erro ao salvar configurações:', error)
      throw error
    }
  }

  // Obter configurações atuais
  getSettings(): SystemSettings {
    return this.settings
  }

  // Atualizar configuração específica
  async updateSetting<K extends keyof SystemSettings>(
    section: K,
    key: keyof SystemSettings[K],
    value: any
  ): Promise<void> {
    const updatedSettings = {
      ...this.settings,
      [section]: {
        ...this.settings[section],
        [key]: value
      }
    }
    
    await this.saveSettings(updatedSettings)
  }

  // Atualizar seção inteira
  async updateSection<K extends keyof SystemSettings>(
    section: K,
    values: Partial<SystemSettings[K]>
  ): Promise<void> {
    const updatedSettings = {
      ...this.settings,
      [section]: {
        ...this.settings[section],
        ...values
      }
    }
    
    await this.saveSettings(updatedSettings)
  }

  // Resetar para configurações padrão
  async resetToDefault(userId: string): Promise<void> {
    const defaultSettings = { ...DEFAULT_SETTINGS, userId }
    await this.saveSettings(defaultSettings)
  }

  // Adicionar listener para mudanças
  addListener(callback: (settings: SystemSettings) => void): () => void {
    this.listeners.push(callback)
    
    // Retornar função para remover listener
    return () => {
      const index = this.listeners.indexOf(callback)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // Notificar todos os listeners
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.settings))
  }

  // Limpar recursos
  cleanup(): void {
    if (this.unsubscribe) {
      this.unsubscribe()
      this.unsubscribe = null
    }
    this.listeners = []
  }

  // Exportar configurações
  exportSettings(): string {
    return JSON.stringify(this.settings, null, 2)
  }

  // Importar configurações
  async importSettings(jsonString: string, userId: string): Promise<void> {
    try {
      const importedSettings = JSON.parse(jsonString) as SystemSettings
      const validatedSettings = { ...DEFAULT_SETTINGS, ...importedSettings, userId }
      await this.saveSettings(validatedSettings)
    } catch (error) {
      console.error('Erro ao importar configurações:', error)
      throw new Error('Formato de configuração inválido')
    }
  }
}

export { SystemSettingsService }
