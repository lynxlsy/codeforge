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
  title: "CodeForge - Serviços Digitais Profissionais",
  description:
    "CodeForge (CDforge) - Especialistas em bots, sites personalizados e automações. Soluções digitais profissionais para seu negócio.",
  generator: "CodeForge",
  keywords: "bots, sites personalizados, automação, serviços digitais, desenvolvimento web",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">
        <AuthProvider>
          <GlobalSettingsInitializer />
          <SystemOptimizer />
          <PricingInitializer />
          <SystemSettingsInitializer />
          <PerformanceOptimizer />
          <CleanModeIndicator />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
