"use client"

import { useEffect, useRef, useCallback } from "react"
import { useGlobalSettings } from "@/hooks/use-global-settings"

interface ParticlesBackgroundProps {
  particleCount?: number
  className?: string
}

export function ParticlesBackground({ particleCount = 30, className = "" }: ParticlesBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<HTMLDivElement[]>([])
  const { settings } = useGlobalSettings()
  const isParticlesDisabled = settings?.performance.disableParticles || false

  const createParticle = useCallback((index: number) => {
    const particle = document.createElement("div")
    particle.className = "particle"
    
    const size = Math.random() > 0.5 ? "2px" : "3px"
    const isBlue = Math.random() > 0.7
    const color = isBlue ? "oklch(0.707 0.165 254.624)" : "rgba(255, 255, 255, 0.6)"
    const duration = 15 + Math.random() * 10
    const delay = Math.random() * 20
    
    particle.style.cssText = `
      position: absolute;
      width: ${size};
      height: ${size};
      background: ${color};
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      animation: float ${duration}s linear infinite;
      animation-delay: ${delay}s;
      opacity: 0.6;
      will-change: transform;
    `
    
    return particle
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Se as partículas estão desabilitadas, não criar nenhuma
    if (isParticlesDisabled) {
      // Limpar partículas existentes
      particlesRef.current.forEach(particle => particle.remove())
      particlesRef.current = []
      return
    }

    // Clear existing particles
    particlesRef.current.forEach(particle => particle.remove())
    particlesRef.current = []

    // Create new particles with a small delay to prevent blocking
    const createParticles = () => {
      const particles = Array.from({ length: particleCount }, (_, i) => {
        const particle = createParticle(i)
        particlesRef.current.push(particle)
        return particle
      })

      particles.forEach((particle) => container.appendChild(particle))
    }

    // Use requestAnimationFrame to ensure smooth rendering
    requestAnimationFrame(createParticles)

    return () => {
      particlesRef.current.forEach((particle) => {
        if (particle && particle.parentNode) {
          particle.remove()
        }
      })
      particlesRef.current = []
    }
  }, [particleCount, createParticle, isParticlesDisabled])

  return (
    <div ref={containerRef} className={`particles-container ${className}`}>
      <style jsx>{`
        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-10vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
