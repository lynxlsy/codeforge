"use client"

import { usePerformanceOptimizer } from "@/hooks/use-performance-optimizer"

export function PerformanceOptimizer() {
  // Aplicar otimizações de performance automaticamente
  usePerformanceOptimizer()
  
  // Componente invisível que apenas aplica as otimizações
  return null
}
