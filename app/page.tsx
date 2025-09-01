"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { DevLoginModal } from "@/components/dev/dev-login-modal"

import { GlobalSettingsInitializer } from "@/components/global-settings-initializer"
import { SystemSettingsInitializer } from "@/components/system-settings-initializer"
import { PricingInitializer } from "@/components/pricing-initializer"
import { PerformanceOptimizer } from "@/components/performance-optimizer"
import { SystemOptimizer } from "@/components/system-optimizer"
import { CleanModeIndicator } from "@/components/clean-mode-indicator"
import { ProductionScreen } from "@/components/production-screen"


export default function HomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showDevLogin, setShowDevLogin] = useState(false)
  const [isProductionMode, setIsProductionMode] = useState(false)

  const handleStartProduction = () => {
    setIsProductionMode(true)
  }

  const handleBackToMain = () => {
    setIsProductionMode(false)
  }

  // Se estiver em modo de produção, mostrar a tela de produção
  if (isProductionMode) {
    return <ProductionScreen onBackToMain={handleBackToMain} />
  }

  return (
    <>
      <GlobalSettingsInitializer />
      <SystemSettingsInitializer />
      <PricingInitializer />
      <PerformanceOptimizer />
      <SystemOptimizer />
      <CleanModeIndicator />
      
      <div className="min-h-screen relative">
        <ParticlesBackground particleCount={40} />
        <Navigation />
        
        <main>
          <HeroSection />
          <FeaturesSection />
        </main>
        
        <Footer />
      </div>

      {/* Modal de Login DEV */}
      <DevLoginModal 
        isOpen={showDevLogin} 
        onClose={() => setShowDevLogin(false)} 
      />
    </>
  )
}
