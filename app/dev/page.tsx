"use client"

import { ProtectedDevRoute } from "@/components/auth/protected-dev-route"
import { DevDashboard } from "@/components/dev/dev-dashboard"

export default function DevPage() {
  return (
    <ProtectedDevRoute>
      <DevDashboard />
    </ProtectedDevRoute>
  )
}
