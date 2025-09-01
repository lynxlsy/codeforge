"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToolLabelBadge } from "@/components/ui/tool-label"
import { useToolLabels } from "@/hooks/use-tool-labels"
import { BackgroundRemover } from "@/components/tools/background-remover"
import { 
  Download,
  Music,
  Video,
  Link,
  FileImage,
  FileText,
  Palette,
  Settings,
  ExternalLink,
  Copy,
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react"

export function ToolsManager() {
  const [showDevelopmentMessage, setShowDevelopmentMessage] = useState<string | null>(null)
  const [showBackgroundRemover, setShowBackgroundRemover] = useState(false)
  const { labels, loading, getLabelForTool } = useToolLabels()

  const handleToolClick = (toolName: string) => {
    if (toolName === "Removedor de Fundo") {
      setShowBackgroundRemover(true)
    } else {
      setShowDevelopmentMessage(toolName)
      setTimeout(() => setShowDevelopmentMessage(null), 3000)
    }
  }

  const downloadPlatforms = [
    { 
      name: "Spotify", 
      icon: "🎵", 
      color: "from-green-600/20 to-green-700/20", 
      borderColor: "border-green-600/30", 
      description: "Baixe músicas e playlists",
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      name: "TikTok", 
      icon: "🎬", 
      color: "from-pink-600/20 to-pink-700/20", 
      borderColor: "border-pink-600/30", 
      description: "Vídeos sem marca d'água",
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      name: "YouTube", 
      icon: "📺", 
      color: "from-red-600/20 to-red-700/20", 
      borderColor: "border-red-600/30", 
      description: "Vídeos e áudios em alta qualidade",
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      name: "Instagram", 
      icon: "📷", 
      color: "from-purple-600/20 to-purple-700/20", 
      borderColor: "border-purple-600/30", 
      description: "Stories, posts e reels",
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      name: "Pinterest", 
      icon: "📌", 
      color: "from-red-500/20 to-red-600/20", 
      borderColor: "border-red-500/30", 
      description: "Imagens e pins",
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      name: "Discord", 
      icon: "💬", 
      color: "from-indigo-600/20 to-indigo-700/20", 
      borderColor: "border-indigo-600/30", 
      description: "Mensagens e arquivos",
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      name: "WhatsApp", 
      icon: "📱", 
      color: "from-green-500/20 to-green-600/20", 
      borderColor: "border-green-500/30", 
      description: "Status e mídias",
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="#3B82F6"/>
        </svg>
      )
    },
    { 
      name: "Telegram", 
      icon: "✈️", 
      color: "from-blue-500/20 to-blue-600/20", 
      borderColor: "border-blue-500/30", 
      description: "Canais e grupos",
      svgIcon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="#3B82F6"/>
        </svg>
      )
    }
  ]

  const converterFormats = [
    { from: "PNG", to: "PDF", icon: FileImage, description: "Converta imagens para PDF" },
    { from: "JPG", to: "PDF", icon: FileImage, description: "Converta JPG para PDF" },
    { from: "PNG", to: "SVG", icon: FileImage, description: "Transforme PNG em SVG vetorial" },
    { from: "JPG", to: "PNG", icon: FileImage, description: "Converta JPG para PNG transparente" },
    { from: "PDF", to: "DOCX", icon: FileText, description: "Extraia texto de PDFs" },
    { from: "MP4", to: "MP3", icon: Video, description: "Extraia áudio de vídeos" },
    { from: "WAV", to: "MP3", icon: Music, description: "Comprima áudio sem perda" }
  ]



  return (
    <div className="space-y-12">
      {/* Baixar Vídeos/Músicas */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-200 mb-4 flex items-center">
            <Download className="w-8 h-8 mr-3 text-blue-400" />
            Baixar Vídeos e Músicas
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl">
            Baixe conteúdo de suas plataformas favoritas com qualidade máxima e sem marca d'água.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {downloadPlatforms.map((platform) => (
            <Card 
              key={platform.name}
              className="relative bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 group cursor-pointer"
              onClick={() => handleToolClick(`${platform.name} Download`)}
            >
              {!loading && getLabelForTool(platform.name) && (
                <div className="absolute top-2 right-2 z-10">
                  <ToolLabelBadge label={getLabelForTool(platform.name)!} />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-12 h-12 flex items-center justify-center mb-2">
                    {platform.svgIcon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-1">{platform.name}</h3>
                    <p className="text-sm text-gray-400">{platform.description}</p>
                  </div>
                  <div className="w-full h-10 bg-gray-800/50 rounded-lg border border-gray-600/30 flex items-center justify-center group-hover:border-gray-500/50 transition-colors">
                    <span className="text-xs text-gray-500 group-hover:text-gray-400">Cole a URL aqui</span>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 text-blue-300 border border-blue-600/30"
                    size="sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Conversor */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-200 mb-4 flex items-center">
            <Settings className="w-8 h-8 mr-3 text-purple-400" />
            Conversor de Formatos
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl">
            Converta arquivos entre diferentes formatos com qualidade profissional e rapidez.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {converterFormats.map((format, index) => (
            <Card 
              key={index}
              className="relative bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600/50 transition-all duration-300 group cursor-pointer"
              onClick={() => handleToolClick(`${format.from} → ${format.to}`)}
            >
              {!loading && getLabelForTool(`${format.from} → ${format.to}`) && (
                <div className="absolute top-2 right-2 z-10">
                  <ToolLabelBadge label={getLabelForTool(`${format.from} → ${format.to}`)!} />
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <format.icon className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200 mb-1">
                      {format.from} → {format.to}
                    </h3>
                    <p className="text-sm text-gray-400">{format.description}</p>
                  </div>
                  <div className="w-full h-10 bg-gray-800/50 rounded-lg border border-gray-600/30 flex items-center justify-center group-hover:border-gray-500/50 transition-colors">
                    <span className="text-xs text-gray-500 group-hover:text-gray-400">Selecionar arquivo</span>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600/20 to-purple-700/20 hover:from-purple-600/30 hover:to-purple-700/30 text-purple-300 border border-purple-600/30"
                    size="sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Converter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Removedor de Fundo */}
      <section>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-200 mb-4 flex items-center">
            <Palette className="w-8 h-8 mr-3 text-green-400" />
            Removedor de Fundo
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl">
            Remova fundos de imagens automaticamente com IA avançada. Perfeito para design e marketing.
          </p>
        </div>
        
        <Card 
          className="relative bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-700/50 backdrop-blur-sm max-w-2xl mx-auto hover:border-green-500/30 transition-all duration-300 cursor-pointer group"
          onClick={() => handleToolClick("Removedor de Fundo")}
        >
          {!loading && getLabelForTool("Removedor de Fundo") && (
            <div className="absolute top-2 right-2 z-10">
              <ToolLabelBadge label={getLabelForTool("Removedor de Fundo")!} />
            </div>
          )}
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-40 h-40 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl border-2 border-dashed border-gray-600/30 flex items-center justify-center group-hover:border-green-500/50 transition-colors">
                <div className="text-center">
                  <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-green-400 transition-colors" />
                  <div className="text-sm text-gray-500 group-hover:text-gray-400">Arraste uma imagem aqui</div>
                  <div className="text-xs text-gray-600 mt-1 group-hover:text-gray-500">ou clique para selecionar</div>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-green-600/20 to-green-700/20 hover:from-green-600/30 hover:to-green-700/30 text-green-300 border border-green-600/30 px-8"
                size="lg"
              >
                <Palette className="w-5 h-5 mr-2" />
                Remover Fundo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>



      {/* Removedor de Fundo Modal */}
      {showBackgroundRemover && (
        <BackgroundRemover onClose={() => setShowBackgroundRemover(false)} />
      )}

      {/* Mensagem de Desenvolvimento */}
      {showDevelopmentMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-200 mb-3">
              Em Desenvolvimento
            </h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              A ferramenta <span className="text-blue-400 font-medium">"{showDevelopmentMessage}"</span> está sendo desenvolvida e estará disponível em breve!
            </p>
            <Button
              onClick={() => setShowDevelopmentMessage(null)}
              className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-600/30 w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              Entendi
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
