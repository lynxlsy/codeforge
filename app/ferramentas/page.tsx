"use client"

import { ToolsManager } from "@/components/tools-manager"
import { ParticlesBackground } from "@/components/particles-background"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function FerramentasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <ParticlesBackground particleCount={40} />
      <Navigation />
      
      {/* Header */}
      <header className="relative z-10 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent mb-6">
              🛠️ Ferramentas
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Conjunto completo de ferramentas profissionais para download, conversão e automação. 
              Tudo que você precisa para otimizar seu trabalho em um só lugar.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <div className="flex items-center space-x-2 bg-blue-600/20 border border-blue-600/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-blue-300 text-sm font-medium">Download de Mídia</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-600/20 border border-purple-600/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-purple-300 text-sm font-medium">Conversão de Formatos</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-600/20 border border-green-600/30 rounded-full px-4 py-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Automação</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="relative z-10 container mx-auto px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <ToolsManager />
        </div>
      </main>

      <Footer />
    </div>
  )
}
