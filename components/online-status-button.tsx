"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Users } from "lucide-react"
import { useOnlineStatusSimple } from "@/hooks/use-online-status-simple"
import { OnlineStatusFallback } from "@/components/online-status-fallback"

interface OnlineStatusButtonProps {
  variant?: "default" | "compact"
  className?: string
}

export function OnlineStatusButton({ variant = "default", className = "" }: OnlineStatusButtonProps) {
  const { isOnline, onlineUsers, error, goOnline, goOffline } = useOnlineStatusSimple()
  const [hasError, setHasError] = useState(false)

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
    return <OnlineStatusFallback variant="button" />
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center space-x-2">
        <Button
          onClick={isOnline ? goOffline : goOnline}
          variant={isOnline ? "destructive" : "default"}
          size="sm"
          className={className}
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
        
        <Badge variant="outline" className="border-green-600/30 text-green-400 text-xs">
          <Users className="w-3 h-3 mr-1" />
          {onlineUsers.length}
        </Badge>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <Button
        onClick={isOnline ? goOffline : goOnline}
        variant={isOnline ? "destructive" : "default"}
        size="sm"
        className={className}
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
      
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
        <Badge variant="outline" className="border-green-600/30 text-green-400 text-xs">
          <Users className="w-3 h-3 mr-1" />
          {onlineUsers.length} online
        </Badge>
      </div>
    </div>
  )
}
