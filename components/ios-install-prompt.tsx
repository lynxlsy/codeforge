"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Share2, X, Smartphone, ArrowUp } from 'lucide-react'

export function IOSInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Check if running as PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true
    setIsStandalone(standalone)

    // Show prompt for iOS users who haven't installed
    if (iOS && !standalone) {
      // Check if user has seen the prompt before
      const hasSeenPrompt = localStorage.getItem('cdforge-ios-prompt-seen')
      if (!hasSeenPrompt) {
        // Delay showing the prompt
        setTimeout(() => {
          setShowPrompt(true)
        }, 3000)
      }
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('cdforge-ios-prompt-seen', 'true')
  }

  const handleInstall = () => {
    // Show detailed instructions
    alert(
      '📱 Como instalar o CDforge no iPhone:\n\n' +
      '1️⃣ Toque no botão Compartilhar (📤) na barra de endereços\n' +
      '2️⃣ Role para baixo e toque em "Adicionar à Tela Inicial"\n' +
      '3️⃣ Toque em "Adicionar"\n\n' +
      '✨ Agora o CDforge aparecerá como um app na sua tela inicial!\n' +
      '🎯 Sem barra de navegação, experiência de app nativo completo.'
    )
    handleDismiss()
  }

  if (!isIOS || isStandalone || !showPrompt) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-blue-900/20 to-blue-800/20 border border-blue-600/30 backdrop-blur-sm animate-in zoom-in-95 duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Instalar CDforge</CardTitle>
                <CardDescription className="text-blue-200">
                  Experiência de app nativo
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Toque no botão <Share2 className="inline w-4 h-4" /> Compartilhar na barra de endereços</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                2
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Role para baixo e toque em "Adicionar à Tela Inicial"</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                3
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Toque em "Adicionar" e pronto!</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-blue-200 text-sm">
              <ArrowUp className="w-4 h-4" />
              <span>Sem barra de navegação, experiência de app nativo completo</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Ver Instruções
            </Button>
            
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="border-blue-600/30 text-blue-300 hover:bg-blue-600/10"
            >
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

