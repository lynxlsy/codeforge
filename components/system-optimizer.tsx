"use client"

import { useState, useEffect } from "react"
import { Monitor, Smartphone, Tablet, Zap } from "lucide-react"

interface OptimizationMetrics {
  deviceDetection: boolean
  domReady: boolean
  imagesLoaded: boolean
  fontsLoaded: boolean
  performanceOptimized: boolean
}

export function SystemOptimizer() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [metrics, setMetrics] = useState<OptimizationMetrics>({
    deviceDetection: false,
    domReady: false,
    imagesLoaded: false,
    fontsLoaded: false,
    performanceOptimized: false,
  })

  useEffect(() => {
    const shouldOptimize = () => {
      const lastOptimization = localStorage.getItem("codeforge-last-optimization")
      const now = Date.now()

      // Run if never optimized before
      if (!lastOptimization) {
        return true
      }

      // Run if last optimization was more than 24 hours ago
      const dayInMs = 24 * 60 * 60 * 1000
      if (now - Number.parseInt(lastOptimization) > dayInMs) {
        return true
      }

      // Check for performance issues
      const performanceIssues = checkPerformanceIssues()
      return performanceIssues
    }

    const checkPerformanceIssues = () => {
      // Check connection speed
      const connection = (navigator as any).connection
      if (
        connection &&
        connection.effectiveType &&
        (connection.effectiveType === "slow-2g" || connection.effectiveType === "2g")
      ) {
        return true
      }

      // Check if page load time is slow
      const loadTime = performance.now()
      if (loadTime > 3000) {
        return true
      }

      // Check memory usage (if available)
      if ("memory" in performance && (performance as any).memory.usedJSHeapSize > 50000000) {
        return true
      }

      return false
    }

    if (!shouldOptimize()) {
      return
    }

    setIsOptimizing(true)

    const optimizeSystem = async () => {
      // Step 1: Device Detection (20%)
      setTimeout(() => {
        const width = window.innerWidth
        const userAgent = navigator.userAgent

        if (width < 768) {
          setDeviceType("mobile")
        } else if (width < 1024) {
          setDeviceType("tablet")
        } else {
          setDeviceType("desktop")
        }

        // Apply device-specific optimizations
        document.documentElement.style.setProperty(
          "--optimization-scale",
          width < 768 ? "0.9" : width < 1024 ? "0.95" : "1",
        )

        setMetrics((prev) => ({ ...prev, deviceDetection: true }))
        setProgress(20)
      }, 300)

      // Step 2: DOM Ready (40%)
      setTimeout(() => {
        if (document.readyState === "complete" || document.readyState === "interactive") {
          setMetrics((prev) => ({ ...prev, domReady: true }))
          setProgress(40)
        }
      }, 600)

      // Step 3: Images Optimization (60%)
      setTimeout(() => {
        const images = document.querySelectorAll("img")
        let loadedImages = 0

        if (images.length === 0) {
          setMetrics((prev) => ({ ...prev, imagesLoaded: true }))
          setProgress(60)
        } else {
          images.forEach((img) => {
            if (img.complete) {
              loadedImages++
            } else {
              img.onload = () => {
                loadedImages++
                if (loadedImages === images.length) {
                  setMetrics((prev) => ({ ...prev, imagesLoaded: true }))
                  setProgress(60)
                }
              }
            }
          })

          if (loadedImages === images.length) {
            setMetrics((prev) => ({ ...prev, imagesLoaded: true }))
            setProgress(60)
          }
        }
      }, 900)

      // Step 4: Fonts Optimization (80%)
      setTimeout(() => {
        if ("fonts" in document) {
          document.fonts.ready.then(() => {
            setMetrics((prev) => ({ ...prev, fontsLoaded: true }))
            setProgress(80)
          })
        } else {
          setMetrics((prev) => ({ ...prev, fontsLoaded: true }))
          setProgress(80)
        }
      }, 1200)

      // Step 5: Performance Optimization (100%)
      setTimeout(() => {
        // Apply final optimizations
        const root = document.documentElement
        root.style.setProperty("--scroll-behavior", "smooth")
        root.style.setProperty("--transition-duration", "0.3s")

        // Enable hardware acceleration for smooth animations
        const animatedElements = document.querySelectorAll('[class*="animate"]')
        animatedElements.forEach((el) => {
          ;(el as HTMLElement).style.willChange = "transform"
        })

        setMetrics((prev) => ({ ...prev, performanceOptimized: true }))
        setProgress(100)

        localStorage.setItem("codeforge-last-optimization", Date.now().toString())

        // Hide optimizer after completion
        setTimeout(() => {
          setIsOptimizing(false)
        }, 800)
      }, 1500)
    }

    optimizeSystem()
  }, [])

  const getDeviceIcon = () => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />
      case "tablet":
        return <Tablet className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  if (!isOptimizing) return null

  return (
    <div className="fixed top-16 right-4 z-50 bg-black/90 backdrop-blur-sm border border-primary/20 rounded-lg p-3 min-w-[280px]">
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2 text-primary">
          <Zap className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-medium">Otimizando Sistema</span>
          {getDeviceIcon()}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>

        <div className="w-full bg-muted/20 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-xs text-muted-foreground space-y-1">
          <div className={`flex items-center gap-2 ${metrics.deviceDetection ? "text-primary" : ""}`}>
            <div
              className={`w-1.5 h-1.5 rounded-full ${metrics.deviceDetection ? "bg-primary" : "bg-muted-foreground/50"}`}
            />
            Detectando dispositivo
          </div>
          <div className={`flex items-center gap-2 ${metrics.domReady ? "text-primary" : ""}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${metrics.domReady ? "bg-primary" : "bg-muted-foreground/50"}`} />
            Carregando interface
          </div>
          <div className={`flex items-center gap-2 ${metrics.imagesLoaded ? "text-primary" : ""}`}>
            <div
              className={`w-1.5 h-1.5 rounded-full ${metrics.imagesLoaded ? "bg-primary" : "bg-muted-foreground/50"}`}
            />
            Otimizando recursos
          </div>
          <div className={`flex items-center gap-2 ${metrics.fontsLoaded ? "text-primary" : ""}`}>
            <div
              className={`w-1.5 h-1.5 rounded-full ${metrics.fontsLoaded ? "bg-primary" : "bg-muted-foreground/50"}`}
            />
            Configurando tipografia
          </div>
          <div className={`flex items-center gap-2 ${metrics.performanceOptimized ? "text-primary" : ""}`}>
            <div
              className={`w-1.5 h-1.5 rounded-full ${metrics.performanceOptimized ? "bg-primary" : "bg-muted-foreground/50"}`}
            />
            Finalizando otimização
          </div>
        </div>
      </div>
    </div>
  )
}
