import { doc, getDoc } from 'firebase/firestore'
import { db } from './firebase'

interface ContactConfig {
  whatsappLink: string
  whatsappNumber: string
  whatsappActive: boolean
  email: string
  emailActive: boolean
  instagramLink: string
  instagramActive: boolean
  telegramLink: string
  telegramNumber: string
  telegramActive: boolean
  discordLink: string
  discordActive: boolean
  primaryContact: any
}

let cachedConfig: ContactConfig | null = null
let lastFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

export async function getContactConfig(): Promise<ContactConfig> {
  const now = Date.now()
  
  // Retornar cache se ainda for válido
  if (cachedConfig && (now - lastFetch) < CACHE_DURATION) {
    return cachedConfig
  }

  try {
    const configRef = doc(db, 'system', 'contact-config')
    const configDoc = await getDoc(configRef)
    
    if (configDoc.exists()) {
      const data = configDoc.data()
      cachedConfig = {
        whatsappLink: data.whatsappLink || 'https://wa.me/5511999999999',
        whatsappNumber: data.whatsappNumber || '(11) 99999-9999',
        whatsappActive: data.whatsappActive !== false,
        email: data.email || 'contato@cdforge.dev',
        emailActive: data.emailActive !== false,
        instagramLink: data.instagramLink || 'https://instagram.com/cdforge',
        instagramActive: data.instagramActive !== false,
        telegramLink: data.telegramLink || 'https://t.me/cdforge',
        telegramNumber: data.telegramNumber || '@cdforge',
        telegramActive: data.telegramActive !== false,
        discordLink: data.discordLink || 'https://discord.gg/cdforge',
        discordActive: data.discordActive !== false,
        primaryContact: data.primaryContact || null
      }
    } else {
      // Configuração padrão
      cachedConfig = {
        whatsappLink: 'https://wa.me/5511999999999',
        whatsappNumber: '(11) 99999-9999',
        whatsappActive: true,
        email: 'contato@cdforge.dev',
        emailActive: true,
        instagramLink: 'https://instagram.com/cdforge',
        instagramActive: true,
        telegramLink: 'https://t.me/cdforge',
        telegramNumber: '@cdforge',
        telegramActive: true,
        discordLink: 'https://discord.gg/cdforge',
        discordActive: true,
        primaryContact: null
      }
    }
    
    lastFetch = now
    return cachedConfig
  } catch (error) {
    console.error('Erro ao carregar configurações de contato:', error)
    // Retornar configuração padrão em caso de erro
    return {
      whatsappLink: 'https://wa.me/5511999999999',
      whatsappNumber: '(11) 99999-9999',
      whatsappActive: true,
      email: 'contato@cdforge.dev',
      emailActive: true,
      instagramLink: 'https://instagram.com/cdforge',
      instagramActive: true,
      telegramLink: 'https://t.me/cdforge',
      telegramNumber: '@cdforge',
      telegramActive: true,
      discordLink: 'https://discord.gg/cdforge',
      discordActive: true,
      primaryContact: null
    }
  }
}

export function getWhatsAppNumber(whatsappLink: string): string {
  const match = whatsappLink.match(/wa\.me\/(\d+)/)
  if (match) {
    const number = match[1]
    // Formatar número brasileiro
    if (number.length >= 11) {
      return `(${number.slice(2,4)}) ${number.slice(4,9)}-${number.slice(9)}`
    }
    return number
  }
  return '(11) 99999-9999'
}

export function getEmailFromConfig(): string {
  return cachedConfig?.email || 'contato@cdforge.dev'
}

export function getWhatsAppFromConfig(): string {
  return cachedConfig?.whatsappNumber || '(11) 99999-9999'
}

export function getTelegramFromConfig(): string {
  return cachedConfig?.telegramNumber || '@cdforge'
}

export function getActiveContactsCount(): number {
  if (!cachedConfig) return 0
  let count = 0
  if (cachedConfig.whatsappActive) count++
  if (cachedConfig.emailActive) count++
  if (cachedConfig.instagramActive) count++
  if (cachedConfig.telegramActive) count++
  if (cachedConfig.discordActive) count++
  return count
}
