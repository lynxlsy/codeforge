import { useState, useEffect } from 'react'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ContactMethod } from '@/lib/types'

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
  primaryContact: ContactMethod | null
}

export function useContactConfig() {
  const [config, setConfig] = useState<ContactConfig>({
    whatsappLink: '',
    whatsappNumber: '',
    whatsappActive: true,
    email: '',
    emailActive: true,
    instagramLink: '',
    instagramActive: true,
    telegramLink: '',
    telegramNumber: '',
    telegramActive: true,
    discordLink: '',
    discordActive: true,
    primaryContact: null
  })
  const [loading, setLoading] = useState(true)

  // Carregar configurações do Firebase
  useEffect(() => {
    const configRef = doc(db, 'system', 'contact-config')
    
    const unsubscribe = onSnapshot(configRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        setConfig({
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
        })
      } else {
        // Configuração padrão se não existir
        const defaultConfig: ContactConfig = {
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
        setConfig(defaultConfig)
        // Salvar configuração padrão no Firebase
        setDoc(configRef, defaultConfig)
      }
      setLoading(false)
    }, (error) => {
      console.error('Erro ao carregar configurações de contato:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const updateConfig = async (newConfig: Partial<ContactConfig>) => {
    try {
      const configRef = doc(db, 'system', 'contact-config')
      const updated = { ...config, ...newConfig }
      await setDoc(configRef, updated)
      setConfig(updated)
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error)
      throw error
    }
  }

  const getWhatsAppLink = () => {
    return config.whatsappLink || 'https://wa.me/5511999999999'
  }

  const getEmail = () => {
    return config.email || 'contato@cdforge.dev'
  }

  const openWhatsApp = (message?: string) => {
    if (!config.whatsappActive) return
    const link = getWhatsAppLink()
    const fullMessage = message ? `?text=${encodeURIComponent(message)}` : ''
    window.open(`${link}${fullMessage}`, '_blank')
  }

  const openEmail = (subject?: string, body?: string) => {
    if (!config.emailActive) return
    const email = getEmail()
    const mailtoLink = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`
    window.open(mailtoLink, '_blank')
  }

  const openInstagram = () => {
    if (!config.instagramActive) return
    const link = config.instagramLink || 'https://instagram.com/cdforge'
    window.open(link, '_blank')
  }

  const openTelegram = (message?: string) => {
    if (!config.telegramActive) return
    const link = config.telegramLink || 'https://t.me/cdforge'
    const fullMessage = message ? `?text=${encodeURIComponent(message)}` : ''
    window.open(`${link}${fullMessage}`, '_blank')
  }

  const openDiscord = () => {
    if (!config.discordActive) return
    const link = config.discordLink || 'https://discord.gg/cdforge'
    window.open(link, '_blank')
  }

  // Função para obter número formatado do WhatsApp
  const getWhatsAppNumber = () => {
    return config.whatsappNumber || '(11) 99999-9999'
  }

  // Função para obter número/username do Telegram
  const getTelegramNumber = () => {
    return config.telegramNumber || '@cdforge'
  }

  // Função para contar contatos ativos
  const getActiveContactsCount = () => {
    let count = 0
    if (config.whatsappActive) count++
    if (config.emailActive) count++
    if (config.instagramActive) count++
    if (config.telegramActive) count++
    if (config.discordActive) count++
    return count
  }

  return {
    config,
    updateConfig,
    getWhatsAppLink,
    getEmail,
    getWhatsAppNumber,
    getTelegramNumber,
    getActiveContactsCount,
    openWhatsApp,
    openEmail,
    openInstagram,
    openTelegram,
    openDiscord,
    loading
  }
}
