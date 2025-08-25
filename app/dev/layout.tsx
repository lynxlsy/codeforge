import type React from "react"
import { Toaster } from "@/components/ui/toaster"

export default function DevLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900">
      {children}
      <Toaster />
    </div>
  )
}
