"use client"

import { useState } from "react"
import { DevNavigation } from "./dev-navigation"
import { DevDashboard } from "./dev-dashboard"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"

interface DevDashboardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DevDashboardModal({ isOpen, onClose }: DevDashboardModalProps) {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dev-modal-content bg-transparent border-none">
        <DialogHeader className="sr-only">
          <DialogTitle>CDforge DEV - Painel Administrativo</DialogTitle>
        </DialogHeader>
        <div className="relative w-full h-full dev-dashboard-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Dashboard content */}
          <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-red-900">
            <DevDashboard 
              isModal={true}
              onClose={onClose}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
