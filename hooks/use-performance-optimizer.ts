import { useEffect } from 'react'
import { useGlobalSettings } from './use-global-settings'

export function usePerformanceOptimizer() {
  const { settings } = useGlobalSettings()

  useEffect(() => {
    // Aplicar configurações de performance em tempo real
    const applyPerformanceSettings = () => {
      const root = document.documentElement
      
      // Modo Clean - Performance Extrema (GLOBAL)
      if (settings?.performance.cleanMode) {
        root.style.setProperty('--clean-mode', '1')
        document.body.classList.add('clean-mode')
        console.log('🌍 Modo Clean ATIVADO globalmente para todos os usuários')
      } else {
        root.style.setProperty('--clean-mode', '0')
        document.body.classList.remove('clean-mode')
        console.log('🌍 Modo Clean DESATIVADO globalmente')
      }

      // Desabilitar Partículas (GLOBAL)
      if (settings?.performance.disableParticles) {
        document.body.classList.add('no-particles')
        // Remover elementos de partículas se existirem
        const particlesElements = document.querySelectorAll('.particles-background, [data-particles]')
        particlesElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = 'none'
          }
        })
        console.log('🌍 Partículas DESABILITADAS globalmente')
      } else {
        document.body.classList.remove('no-particles')
        // Restaurar elementos de partículas
        const particlesElements = document.querySelectorAll('.particles-background, [data-particles]')
        particlesElements.forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = ''
          }
        })
        console.log('🌍 Partículas HABILITADAS globalmente')
      }

      // Desabilitar Animações (GLOBAL)
      if (settings?.performance.disableAnimations) {
        document.body.classList.add('no-animations')
        root.style.setProperty('--animation-duration', '0s')
        root.style.setProperty('--transition-duration', '0s')
        console.log('🌍 Animações DESABILITADAS globalmente')
      } else {
        document.body.classList.remove('no-animations')
        root.style.setProperty('--animation-duration', '')
        root.style.setProperty('--transition-duration', '')
        console.log('🌍 Animações HABILITADAS globalmente')
      }

      // Reduzir Movimento (GLOBAL)
      if (settings?.performance.reduceMotion) {
        document.body.classList.add('reduce-motion')
        root.style.setProperty('--motion-reduction', '1')
        console.log('🌍 Movimento REDUZIDO globalmente')
      } else {
        document.body.classList.remove('reduce-motion')
        root.style.setProperty('--motion-reduction', '0')
        console.log('🌍 Movimento NORMAL globalmente')
      }

      // UI Mínima (GLOBAL)
      if (settings?.performance.minimalUI) {
        document.body.classList.add('minimal-ui')
        root.style.setProperty('--ui-complexity', 'minimal')
        console.log('🌍 UI Mínima ATIVADA globalmente')
      } else {
        document.body.classList.remove('minimal-ui')
        root.style.setProperty('--ui-complexity', 'normal')
        console.log('🌍 UI Normal globalmente')
      }

      // Aplicar preferência de movimento reduzido do sistema
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || settings?.performance.reduceMotion) {
        document.body.classList.add('prefers-reduced-motion')
      } else {
        document.body.classList.remove('prefers-reduced-motion')
      }
    }

    // Aplicar configurações imediatamente
    applyPerformanceSettings()

    // Escutar mudanças na preferência de movimento do sistema
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleMotionChange = () => {
      applyPerformanceSettings()
    }

    mediaQuery.addEventListener('change', handleMotionChange)

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange)
    }
  }, [settings])

  return {
    isCleanMode: settings?.performance.cleanMode || false,
    isParticlesDisabled: settings?.performance.disableParticles || false,
    isAnimationsDisabled: settings?.performance.disableAnimations || false,
    isMotionReduced: settings?.performance.reduceMotion || false,
    isMinimalUI: settings?.performance.minimalUI || false
  }
}
