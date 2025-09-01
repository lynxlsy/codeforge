"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wifi, WifiOff, Users, AlertCircle, Minimize2 } from "lucide-react"

interface OnlineStatusFallbackProps {
  variant?: "bar" | "button"
}

export function OnlineStatusFallback({ variant = "bar" }: OnlineStatusFallbackProps) {
  const [isOnline, setIsOnline] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const toggleStatus = () => {
    setIsOnline(!isOnline)
  }

  if (variant === "button") {
    return (
      <div className="flex items-center space-x-2">
        <Button
          onClick={toggleStatus}
          variant={isOnline ? "destructive" : "default"}
          size="sm"
        >
          {isOnline ? (
            <>
              <WifiOff className="w-4 h-4 mr-1" />
              Offline
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 mr-1" />
              Online
            </>
          )}
        </Button>
        
        <Badge variant="outline" className="border-orange-600/30 text-orange-400 text-xs">
          <AlertCircle className="w-3 h-3 mr-1" />
          Local
        </Badge>
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
          title="Expandir barra de status (modo local)"
        >
          <div className="relative">
            <AlertCircle className="w-4 h-4 text-orange-400" />
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
              <Badge variant="outline" className="border-orange-600/30 text-orange-400 text-xs">
                <AlertCircle className="w-3 h-3 mr-1" />
                Modo Local
              </Badge>
              
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
              onClick={toggleStatus}
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

          {/* Aviso */}
          <div className="text-center py-4 border-t border-[#262626]">
            <AlertCircle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-sm text-orange-400 mb-2">Sistema Online Indisponível</p>
            <p className="text-xs text-gray-400">Funcionando em modo local</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
