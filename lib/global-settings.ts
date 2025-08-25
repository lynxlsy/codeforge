import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

export interface GlobalSettings {
  // Configurações de Performance Globais
  performance: {
    cleanMode: boolean
    disableParticles: boolean
    disableAnimations: boolean
    reduceMotion: boolean
    minimalUI: boolean
    imageCompression: boolean
    lazyLoading: boolean
    cacheStrategy: 'aggressive' | 'balanced' | 'minimal'
  }
  
  // Configurações de UI Globais
  ui: {
    theme: 'dark' | 'light' | 'auto'
    animations: boolean
    reducedMotion: boolean
    fontSize: 'small' | 'medium' | 'large'
  }
  
  // Configurações de Sistema Globais
  system: {
    maintenanceMode: boolean
    maintenanceMessage: string
    version: string
    forceUpdate: boolean
  }
  
  // Metadados
  lastUpdated: string
  updatedBy: string
  version: string
}

const DEFAULT_GLOBAL_SETTINGS: GlobalSettings = {
  performance: {
    cleanMode: false,
    disableParticles: false,
    disableAnimations: false,
    reduceMotion: false,
    minimalUI: false,
    imageCompression: true,
    lazyLoading: true,
    cacheStrategy: 'balanced'
  },
  ui: {
    theme: 'dark',
    animations: true,
    reducedMotion: false,
    fontSize: 'medium'
  },
  system: {
    maintenanceMode: false,
    maintenanceMessage: '',
    version: '1.0.0',
    forceUpdate: false
  },
  lastUpdated: new Date().toISOString(),
  updatedBy: 'system',
  version: '1.0.0'
}

class GlobalSettingsService {
  private static instance: GlobalSettingsService
  private settings: GlobalSettings = DEFAULT_GLOBAL_SETTINGS
  private listeners: ((settings: GlobalSettings) => void)[] = []
  private unsubscribe: (() => void) | null = null

  static getInstance(): GlobalSettingsService {
    if (!GlobalSettingsService.instance) {
      GlobalSettingsService.instance = new GlobalSettingsService()
    }
    return GlobalSettingsService.instance
  }

  // Carregar configurações globais do Firebase
  async loadGlobalSettings(): Promise<GlobalSettings> {
    try {
      const settingsRef = doc(db, 'global-settings', 'main')
      
      // Configurar listener em tempo real para TODOS os usuários
      this.unsubscribe = onSnapshot(settingsRef, async (doc) => {
        if (doc.exists()) {
          const data = doc.data() as GlobalSettings
          this.settings = { ...DEFAULT_GLOBAL_SETTINGS, ...data }
          console.log('🌍 Configurações globais carregadas:', this.settings)
          this.notifyListeners()
        } else {
          // Criar configurações globais padrão
          const defaultSettings = { ...DEFAULT_GLOBAL_SETTINGS }
          this.settings = defaultSettings
          await this.saveGlobalSettings(defaultSettings)
          this.notifyListeners()
        }
      }, (error) => {
        console.error('Erro ao carregar configurações globais:', error)
        // Usar configurações padrão em caso de erro
        this.settings = { ...DEFAULT_GLOBAL_SETTINGS }
        this.notifyListeners()
      })

      return this.settings
    } catch (error) {
      console.error('Erro ao carregar configurações globais:', error)
      this.settings = { ...DEFAULT_GLOBAL_SETTINGS }
      return this.settings
    }
  }

  // Salvar configurações globais no Firebase
  async saveGlobalSettings(settings: Partial<GlobalSettings>): Promise<void> {
    try {
      const updatedSettings = {
        ...this.settings,
        ...settings,
        lastUpdated: new Date().toISOString()
      }

      const settingsRef = doc(db, 'global-settings', 'main')
      await setDoc(settingsRef, updatedSettings, { merge: true })
      
      this.settings = updatedSettings
      this.notifyListeners()
      console.log('🌍 Configurações globais salvas:', updatedSettings)
    } catch (error) {
      console.error('Erro ao salvar configurações globais:', error)
      throw error
    }
  }

  // Obter configurações globais atuais
  getGlobalSettings(): GlobalSettings {
    return this.settings
  }

  // Atualizar configuração global específica
  async updateGlobalSetting<K extends keyof GlobalSettings>(
    section: K,
    key: keyof GlobalSettings[K],
    value: any,
    updatedBy: string = 'system'
  ): Promise<void> {
    const updatedSettings = {
      ...this.settings,
      [section]: {
        ...this.settings[section],
        [key]: value
      },
      updatedBy
    }
    
    await this.saveGlobalSettings(updatedSettings)
  }

  // Atualizar seção global inteira
  async updateGlobalSection<K extends keyof GlobalSettings>(
    section: K,
    values: Partial<GlobalSettings[K]>,
    updatedBy: string = 'system'
  ): Promise<void> {
    const updatedSettings = {
      ...this.settings,
      [section]: {
        ...this.settings[section],
        ...values
      },
      updatedBy
    }
    
    await this.saveGlobalSettings(updatedSettings)
  }

  // Resetar para configurações globais padrão
  async resetToDefault(updatedBy: string = 'system'): Promise<void> {
    const defaultSettings = { ...DEFAULT_GLOBAL_SETTINGS, updatedBy }
    await this.saveGlobalSettings(defaultSettings)
  }

  // Adicionar listener para mudanças globais
  addListener(callback: (settings: GlobalSettings) => void): () => void {
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

  // Exportar configurações globais
  exportGlobalSettings(): string {
    return JSON.stringify(this.settings, null, 2)
  }

  // Importar configurações globais
  async importGlobalSettings(jsonString: string, updatedBy: string): Promise<void> {
    try {
      const importedSettings = JSON.parse(jsonString) as GlobalSettings
      const validatedSettings = { ...DEFAULT_GLOBAL_SETTINGS, ...importedSettings, updatedBy }
      await this.saveGlobalSettings(validatedSettings)
    } catch (error) {
      console.error('Erro ao importar configurações globais:', error)
      throw new Error('Formato de configuração global inválido')
    }
  }
}

export { GlobalSettingsService }
