"use client"

import { Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import type { ProjectData } from "./project-flow"

interface Platform {
  id: string
  name: string
  description: string
  basePrice: number
  features: string[]
}

interface PlatformSelectionProps {
  platforms: Platform[]
  projectData: ProjectData
  setProjectData: (data: ProjectData) => void
  onNext: () => void
}

const getPlatformStyle = (platformName: string) => {
  switch (platformName.toLowerCase()) {
    case "discord bot":
      return {
        gradient: "from-primary to-blue-600",
        logo: "/images/discord-logo.svg",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/20",
        hoverBgColor: "hover:bg-primary/10",
        selectedBgColor: "bg-primary/15",
        logoFilter: "",
        iconBg: "bg-white",
      }
    case "instagram automation":
    case "instagram bot":
      return {
        gradient: "from-primary to-blue-600",
        logo: "/images/instagram-logo.svg",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/20",
        hoverBgColor: "hover:bg-primary/10",
        selectedBgColor: "bg-primary/15",
        logoFilter: "",
        iconBg: "bg-white",
      }
    case "whatsapp bot":
      return {
        gradient: "from-primary to-blue-600",
        logo: "/images/whatsapp-logo.svg",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/20",
        hoverBgColor: "hover:bg-primary/10",
        selectedBgColor: "bg-primary/15",
        logoFilter: "",
        iconBg: "bg-white",
      }
    case "telegram bot":
      return {
        gradient: "from-primary to-blue-600",
        logo: "/images/telegram-logo.svg",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/20",
        hoverBgColor: "hover:bg-primary/10",
        selectedBgColor: "bg-primary/15",
        logoFilter: "",
        iconBg: "bg-white",
      }
    case "sistema personalizado":
    case "sistema":
      return {
        gradient: "from-primary to-blue-600",
        logo: "/placeholder-logo.svg",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/20",
        hoverBgColor: "hover:bg-primary/10",
        selectedBgColor: "bg-primary/15",
        logoFilter: "",
        iconBg: "bg-white",
      }
    default:
      return {
        gradient: "from-primary to-blue-600",
        logo: "/placeholder-logo.svg",
        bgColor: "bg-primary/5",
        borderColor: "border-primary/20",
        hoverBgColor: "hover:bg-primary/10",
        selectedBgColor: "bg-primary/15",
        logoFilter: "filter brightness-0 invert",
        iconBg: "bg-primary",
      }
  }
}

export function PlatformSelection({ platforms, projectData, setProjectData, onNext }: PlatformSelectionProps) {
  const handlePlatformSelect = (platform: Platform) => {
    setProjectData({ ...projectData, platform })
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-serif font-bold text-2xl md:text-3xl mb-4">Selecione a Plataforma</h2>
        <p className="text-muted-foreground">Escolha a opção que melhor se adequa ao seu projeto</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {platforms.map((platform) => {
          const platformStyle = getPlatformStyle(platform.name)
          const isSelected = projectData.platform?.id === platform.id

          return (
            <Card
              key={platform.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 min-h-[280px] flex flex-col ${
                isSelected
                  ? `ring-2 ring-primary border-primary ${platformStyle.selectedBgColor}`
                  : `${platformStyle.bgColor} hover:border-2 hover:${platformStyle.borderColor} ${platformStyle.hoverBgColor}`
              }`}
              onClick={() => handlePlatformSelect(platform)}
            >
              <CardHeader className="pb-4 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`p-3 rounded-xl ${platformStyle.iconBg} shadow-lg flex-shrink-0`}>
                      <Image
                        src={platformStyle.logo}
                        alt={`${platform.name} logo`}
                        width={32}
                        height={32}
                        className={`w-8 h-8 object-contain ${platformStyle.logoFilter}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-serif font-bold break-words leading-tight">{platform.name}</CardTitle>
                      <CardDescription className="mt-1 text-sm leading-relaxed line-clamp-2">{platform.description}</CardDescription>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="ml-2 p-1.5 bg-primary rounded-full flex-shrink-0">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Badge
                    variant="secondary"
                    className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg"
                  >
                    <span className="flex items-center gap-1">
                      <span className="text-base">🔥</span>
                      A partir de 73% OFF
                    </span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Funcionalidades Incluídas
                  </h4>
                  <ul className="space-y-2">
                    {platform.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 mt-2 flex-shrink-0" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                    {platform.features.length > 4 && (
                      <li className="text-sm text-muted-foreground flex items-start">
                        <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full mr-2 mt-2 flex-shrink-0" />
                        <span>+{platform.features.length - 4} funcionalidades adicionais</span>
                      </li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {projectData.platform && (
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Plataforma selecionada: <span className="font-semibold text-foreground">{projectData.platform.name}</span>
          </p>
        </div>
      )}


      
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
