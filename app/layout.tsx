import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { SystemOptimizer } from "@/components/system-optimizer"
import { PricingInitializer } from "@/components/pricing-initializer"
import { SystemSettingsInitializer } from "@/components/system-settings-initializer"
import { PerformanceOptimizer } from "@/components/performance-optimizer"
import { CleanModeIndicator } from "@/components/clean-mode-indicator"
import { GlobalSettingsInitializer } from "@/components/global-settings-initializer"
import { ThemeStatic } from "@/components/theme-static"
import { PWAInstaller } from "@/components/pwa-installer"
import { StructuredData } from "./structured-data"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"], // Including black weight for headings
})

export const metadata: Metadata = {
  title: "CodeForge - Transforme suas ideias em soluções digitais",
  description:
    "CodeForge (CDforge) - Especialistas em bots inteligentes, sites profissionais e automações avançadas. Transformamos suas ideias em soluções digitais inovadoras.",
  generator: "CodeForge",
  keywords: "cdforge, codeforge, bots inteligentes, sites profissionais, automação, serviços digitais, desenvolvimento web, transformação digital",
  authors: [{ name: "CodeForge Team" }],
  creator: "CodeForge",
  publisher: "CodeForge",
  robots: "index, follow",
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://cdforge.shop",
    siteName: "CodeForge",
    title: "CodeForge - Transforme suas ideias em soluções digitais",
    description: "Especialistas em bots inteligentes, sites profissionais e automações avançadas. Transformamos suas ideias em soluções digitais inovadoras.",
    images: [
      {
        url: "https://cdforge.shop/logo.svg",
        width: 512,
        height: 512,
        alt: "CodeForge Logo - Transforme suas ideias em soluções digitais",
      },
      {
        url: "https://cdforge.shop/icons/icon-512x512.svg",
        width: 512,
        height: 512,
        alt: "CodeForge Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeForge - Transforme suas ideias em soluções digitais",
    description: "Especialistas em bots inteligentes, sites profissionais e automações avançadas.",
    images: ["https://cdforge.shop/logo.svg"],
    creator: "@codeforge",
    site: "@codeforge",
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icons/icon-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/icons/icon-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icons/ios-icon-180x180.svg", sizes: "180x180", type: "image/svg+xml" },
      { url: "/icons/ios-icon-152x152.svg", sizes: "152x152", type: "image/svg+xml" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "CDforge",
    "application-name": "CDforge",
    "msapplication-TileColor": "#3B82F6",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#3B82F6",
    "color-scheme": "dark",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} antialiased dark`} data-theme="dark" style={{colorScheme: "dark"}}>
      <head>
        {/* PWA Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CDforge" />
        <meta name="application-name" content="CDforge" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/ios-icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/ios-icon-180x180.svg" />
        
        {/* Apple Startup Images */}
        <link rel="apple-touch-startup-image" href="/icons/ios-icon-180x180.svg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/ios-icon-180x180.svg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/ios-icon-180x180.svg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-3)" />
        <link rel="apple-touch-startup-image" href="/icons/ios-icon-180x180.svg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/ios-icon-180x180.svg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        {/* Structured Data for SEO */}
        <StructuredData />
      </head>
      <body className="font-sans bg-background text-foreground">
        <ThemeStatic />
        <AuthProvider>
          <GlobalSettingsInitializer />
          <SystemOptimizer />
          <PricingInitializer />
          <SystemSettingsInitializer />
          <PerformanceOptimizer />
          <CleanModeIndicator />
          {children}
          <PWAInstaller />
        </AuthProvider>
      </body>
    </html>
  )
}
