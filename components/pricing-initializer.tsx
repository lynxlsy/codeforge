"use client"

import { useEffect } from "react"
import { loadPricingFromFirebase } from "@/lib/pricing"

export function PricingInitializer() {
  useEffect(() => {
    // Carregar preços do Firebase quando a aplicação inicia
    loadPricingFromFirebase()
  }, [])

  return null // Componente não renderiza nada
}
