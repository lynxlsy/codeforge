"use client"

import { useGlobalSettings } from "@/hooks/use-global-settings"
import { Zap, X } from "lucide-react"
import { useState } from "react"

export function CleanModeIndicator() {
  const { settings } = useGlobalSettings()
  const isCleanMode = settings?.performance.cleanMode || false
  const [isVisible, setIsVisible] = useState(true)

  if (!isCleanMode || !isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-green-900/90 backdrop-blur-sm border border-green-500/30 rounded-lg px-4 py-2 flex items-center space-x-2 shadow-lg">
        <Zap className="h-4 w-4 text-green-400 animate-pulse" />
        <span className="text-green-100 text-sm font-medium">
          Modo Clean Ativo
        </span>
        <button
          onClick={() => setIsVisible(false)}
          className="text-green-300 hover:text-green-100 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
