"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle, FileText } from "lucide-react"
import { ParticlesBackground } from "@/components/particles-background"

export default function FormsPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <ParticlesBackground particleCount={40} />

      {/* Gradiente de fundo sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-blue-600/10" />

      {/* Header Responsivo */}
      <header className="relative z-10 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                CodeForge Forms
              </h1>
              <p className="text-xs text-blue-400 hidden sm:block">Sistema de Formulários Inteligente</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-blue-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[calc(100vh-300px)]">
          <Card className="bg-[#141414]/95 backdrop-blur-xl border border-[#262626] shadow-2xl max-w-2xl w-full animate-in slide-in-from-bottom-6 duration-1000">
            {/* Gradiente de fundo sutil */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 rounded-lg" />
            
            <CardHeader className="text-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-3 font-serif">
                Funcionalidade em Andamento
              </CardTitle>
              <p className="text-gray-300 text-lg leading-relaxed">
                O sistema de formulários está sendo desenvolvido e estará disponível em breve.
              </p>
            </CardHeader>
            
            <CardContent className="text-center space-y-6 relative z-10">
              <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
                <p className="text-blue-300 font-medium text-lg">
                  Estamos trabalhando para trazer uma experiência incrível de criação de formulários!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                  <h4 className="font-semibold text-blue-400 mb-2">🎨 Design Moderno</h4>
                  <p className="text-gray-400">Interface limpa e intuitiva</p>
                </div>
                <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                  <h4 className="font-semibold text-blue-400 mb-2">📱 Responsivo</h4>
                  <p className="text-gray-400">Otimizado para todos os dispositivos</p>
                </div>
                <div className="bg-[#1f1f1f] border border-[#333] rounded-xl p-4 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                  <h4 className="font-semibold text-blue-400 mb-2">⚡ Rápido</h4>
                  <p className="text-gray-400">Performance otimizada</p>
                </div>
              </div>

              <div className="pt-4 border-t border-[#333]">
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="border-2 border-[#3b82f6]/50 text-[#3b82f6] hover:bg-[#3b82f6]/10 hover:border-[#3b82f6] hover:text-blue-300 font-semibold py-3 px-8 rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

