"use client"

import { ProtectedDevRoute } from "@/components/auth/protected-dev-route"
import { DevContent } from "@/components/dev/dev-content"

export default function DevPage() {
  return (
    <ProtectedDevRoute>
      <DevContent />
    </ProtectedDevRoute>
  )
}
