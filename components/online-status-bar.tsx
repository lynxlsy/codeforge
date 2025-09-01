"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Wifi, 
  WifiOff, 
  Users, 
  ChevronDown, 
  ChevronUp,
  User,
  Code,
  Briefcase,
  AlertCircle,
  Minimize2,
  Maximize2
} from "lucide-react"
import { useOnlineStatusSimple } from "@/hooks/use-online-status-simple"
import { OnlineStatusFallback } from "@/components/online-status-fallback"

export function OnlineStatusBar() {
  const { isOnline, onlineUsers, loading, error, goOnline, goOffline } = useOnlineStatusSimple()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [hasError, setHasError] = useState(false)

  const devsOnline = onlineUsers.filter(user => user.role === 'dev')
  const funcionariosOnline = onlineUsers.filter(user => user.role === 'funcionario')

  // Detectar erros do Firebase
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('FIRESTORE') || event.error?.message?.includes('firebase')) {
        setHasError(true)
      }
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // Se houver erro, usar fallback
  if (hasError || error) {
    return <OnlineStatusFallback variant="bar" />
  }

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-black/80 backdrop-blur-xl border border-[#262626] shadow-2xl">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <span className="text-sm text-gray-400">Carregando...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Versão minimizada - apenas ícone pequeno
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          variant="ghost"
          size="sm"
          className="bg-black/80 backdrop-blur-xl border border-[#262626] shadow-2xl hover:bg-black/90 p-2 rounded-full w-10 h-10"
          title="Expandir barra de status"
        >
          <div className="relative">
            <Users className="w-4 h-4 text-gray-300" />
            {onlineUsers.length > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs text-black font-bold">{onlineUsers.length}</span>
              </div>
            )}
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="bg-black/80 backdrop-blur-xl border border-[#262626] shadow-2xl min-w-[300px]">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium text-white">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="border-green-600/30 text-green-400 text-xs">
                <Users className="w-3 h-3 mr-1" />
                {onlineUsers.length} online
              </Badge>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-white"
                title={isExpanded ? "Recolher lista" : "Expandir lista"}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-white"
                title="Minimizar barra"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Botão Online/Offline */}
          <div className="mb-3">
            <Button
              onClick={isOnline ? goOffline : goOnline}
              variant={isOnline ? "destructive" : "default"}
              size="sm"
              className="w-full"
            >
              {isOnline ? (
                <>
                  <WifiOff className="w-4 h-4 mr-2" />
                  Ficar Offline
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 mr-2" />
                  Ficar Online
                </>
              )}
            </Button>
          </div>

          {/* Lista de usuários online (expandida) */}
          {isExpanded && (
            <div className="space-y-3 border-t border-[#262626] pt-3">
              {/* Devs Online */}
              {devsOnline.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Desenvolvedores</span>
                    <Badge variant="outline" className="border-blue-600/30 text-blue-400 text-xs">
                      {devsOnline.length}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {devsOnline.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-300">{user.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Funcionários Online */}
              {funcionariosOnline.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Briefcase className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Funcionários</span>
                    <Badge variant="outline" className="border-green-600/30 text-green-400 text-xs">
                      {funcionariosOnline.length}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    {funcionariosOnline.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <User className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-300">{user.username}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Nenhum usuário online */}
              {onlineUsers.length === 0 && (
                <div className="text-center py-4">
                  <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Nenhum usuário online</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
