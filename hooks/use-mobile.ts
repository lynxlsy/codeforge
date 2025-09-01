import { useState, useEffect } from 'react'

interface MobileInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLandscape: boolean
  isPortrait: boolean
  screenWidth: number
  screenHeight: number
  isTouchDevice: boolean
  isIOS: boolean
  isAndroid: boolean
  isSafari: boolean
  isChrome: boolean
  isFirefox: boolean
}

export function useMobile(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLandscape: false,
    isPortrait: false,
    screenWidth: 0,
    screenHeight: 0,
    isTouchDevice: false,
    isIOS: false,
    isAndroid: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
  })

  useEffect(() => {
    const updateMobileInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      // Detect device type
      const isMobile = width < 640
      const isTablet = width >= 640 && width < 1024
      const isDesktop = width >= 1024
      
      // Detect orientation
      const isLandscape = width > height
      const isPortrait = height > width
      
      // Detect touch device
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // Detect OS
      const userAgent = navigator.userAgent.toLowerCase()
      const isIOS = /iphone|ipad|ipod/.test(userAgent)
      const isAndroid = /android/.test(userAgent)
      
      // Detect browser
      const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)
      const isChrome = /chrome/.test(userAgent) && !/edge/.test(userAgent)
      const isFirefox = /firefox/.test(userAgent)
      
      setMobileInfo({
        isMobile,
        isTablet,
        isDesktop,
        isLandscape,
        isPortrait,
        screenWidth: width,
        screenHeight: height,
        isTouchDevice,
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isFirefox,
      })
    }

    // Initial check
    updateMobileInfo()

    // Add event listeners
    window.addEventListener('resize', updateMobileInfo)
    window.addEventListener('orientationchange', updateMobileInfo)

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateMobileInfo)
      window.removeEventListener('orientationchange', updateMobileInfo)
    }
  }, [])

  return mobileInfo
}

// Hook específico para funcionalidades mobile
export function useMobileFeatures() {
  const mobileInfo = useMobile()
  
  const getResponsiveClass = (mobileClass: string, tabletClass: string, desktopClass: string) => {
    if (mobileInfo.isMobile) return mobileClass
    if (mobileInfo.isTablet) return tabletClass
    return desktopClass
  }
  
  const getGridCols = () => {
    if (mobileInfo.isMobile) return 1
    if (mobileInfo.isTablet) return 2
    return 4
  }
  
  const getCardSpacing = () => {
    if (mobileInfo.isMobile) return 'space-y-3'
    if (mobileInfo.isTablet) return 'space-y-4'
    return 'space-y-6'
  }
  
  const getTextSize = (mobile: string, tablet: string, desktop: string) => {
    if (mobileInfo.isMobile) return mobile
    if (mobileInfo.isTablet) return tablet
    return desktop
  }
  
  const getPadding = (mobile: string, tablet: string, desktop: string) => {
    if (mobileInfo.isMobile) return mobile
    if (mobileInfo.isTablet) return tablet
    return desktop
  }
  
  const shouldShowSidebar = () => {
    return !mobileInfo.isMobile || mobileInfo.screenWidth >= 1024
  }
  
  const getModalSize = () => {
    if (mobileInfo.isMobile) return 'w-[95vw] max-w-sm'
    if (mobileInfo.isTablet) return 'w-[90vw] max-w-md'
    return 'w-[80vw] max-w-lg'
  }
  
  const getButtonSize = () => {
    if (mobileInfo.isMobile) return 'sm'
    if (mobileInfo.isTablet) return 'default'
    return 'lg'
  }
  
  const getIconSize = () => {
    if (mobileInfo.isMobile) return 'h-4 w-4'
    if (mobileInfo.isTablet) return 'h-5 w-5'
    return 'h-6 w-6'
  }
  
  return {
    ...mobileInfo,
    getResponsiveClass,
    getGridCols,
    getCardSpacing,
    getTextSize,
    getPadding,
    shouldShowSidebar,
    getModalSize,
    getButtonSize,
    getIconSize,
  }
}
