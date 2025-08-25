"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { ProjectData } from "./project-flow"

interface ProjectDetailsProps {
  platforms: any[]
  projectData: ProjectData
  setProjectData: (data: ProjectData) => void
  onNext: () => void
}

export function ProjectDetails({ projectData, setProjectData }: ProjectDetailsProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(projectData.features || [])

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setProjectData({ ...projectData, [field]: value })
  }

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    const updatedFeatures = checked ? [...selectedFeatures, feature] : selectedFeatures.filter((f) => f !== feature)

    setSelectedFeatures(updatedFeatures)
    setProjectData({ ...projectData, features: updatedFeatures })
  }

  const getWordCount = (text: string) => {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length
  }

  const descriptionWordCount = getWordCount(projectData.description || "")

  const getPriceImpact = (wordCount: number) => {
    if (wordCount > 100) return { text: "Impacto no preço: +40%", color: "text-red-500" }
    if (wordCount > 50) return { text: "Impacto no preço: +25%", color: "text-orange-500" }
    if (wordCount > 20) return { text: "Impacto no preço: +15%", color: "text-yellow-600" }
    if (wordCount > 10) return { text: "Impacto no preço: +5%", color: "text-blue-500" }
    return { text: "Impacto no preço: neutro", color: "text-green-500" }
  }

  const priceImpact = getPriceImpact(descriptionWordCount)

  const complexityOptions = [
    {
      value: "basic",
      label: "Básico",
      description: "Funcionalidades essenciais, design simples",
      multiplier: 1,
    },
    {
      value: "intermediate",
      label: "Intermediário",
      description: "Funcionalidades avançadas, design personalizado",
      multiplier: 1.5,
    },
    {
      value: "advanced",
      label: "Avançado",
      description: "Funcionalidades complexas, integrações múltiplas",
      multiplier: 2,
    },
  ]

  const timelineOptions = [
    {
      value: "urgent",
      label: "Urgente (1-3 dias)",
      description: "Entrega prioritária",
      multiplier: 1.5,
    },
    {
      value: "normal",
      label: "Normal (1-2 semanas)",
      description: "Prazo padrão",
      multiplier: 1,
    },
    {
      value: "flexible",
      label: "Flexível (2-4 semanas)",
      description: "Sem pressa, melhor preço",
      multiplier: 0.9,
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-serif font-bold text-2xl md:text-3xl mb-4">Detalhes do Projeto</h2>
        <p className="text-muted-foreground">Conte-nos mais sobre suas necessidades</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={projectData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa (opcional)</Label>
              <Input
                id="company"
                value={projectData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                placeholder="Nome da sua empresa"
              />
            </div>

            <div className="space-y-3">
              <Label>Forma de Contato Preferida *</Label>
              <RadioGroup
                value={projectData.contactMethod}
                onValueChange={(value: "email" | "whatsapp") => handleInputChange("contactMethod", value)}
              >
                <div 
                  className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleInputChange("contactMethod", "email")}
                >
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="cursor-pointer">E-mail</Label>
                </div>
                <div 
                  className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleInputChange("contactMethod", "whatsapp")}
                >
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp" className="cursor-pointer">WhatsApp</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">{projectData.contactMethod === "email" ? "E-mail" : "WhatsApp"} *</Label>
              <Input
                id="contact"
                value={projectData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                placeholder={projectData.contactMethod === "email" ? "seu@email.com" : "(11) 99999-9999"}
                type={projectData.contactMethod === "email" ? "email" : "tel"}
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Especificações do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="description">Descrição do Projeto *</Label>
                <div className="text-sm text-muted-foreground">{descriptionWordCount} palavras</div>
              </div>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Descreva detalhadamente o que você precisa... Quanto mais detalhes, mais preciso será o orçamento."
                rows={4}
              />
              {descriptionWordCount > 0 && (
                <div className={`text-xs ${priceImpact.color} font-medium`}>{priceImpact.text}</div>
              )}
              <div className="text-xs text-muted-foreground">
                💡 Dica: Descrições mais detalhadas resultam em orçamentos mais precisos, mas podem aumentar o preço
                baseado na complexidade identificada.
              </div>
            </div>

            <div className="space-y-3">
              <Label>Nível de Complexidade</Label>
              <RadioGroup
                value={projectData.complexity}
                onValueChange={(value: "basic" | "intermediate" | "advanced") => handleInputChange("complexity", value)}
              >
                {complexityOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleInputChange("complexity", option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={option.value} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Prazo Desejado</Label>
              <RadioGroup
                value={projectData.timeline}
                onValueChange={(value: "urgent" | "normal" | "flexible") => handleInputChange("timeline", value)}
              >
                {timelineOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleInputChange("timeline", option.value)}
                  >
                    <RadioGroupItem value={option.value} id={`timeline-${option.value}`} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={`timeline-${option.value}`} className="font-medium cursor-pointer">
                        {option.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Features */}
      {projectData.platform && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Funcionalidades Adicionais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projectData.platform.features.map((feature) => (
                <div 
                  key={feature} 
                  className="flex items-center space-x-2 p-2 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleFeatureToggle(feature, !selectedFeatures.includes(feature))}
                >
                  <Checkbox
                    id={feature}
                    checked={selectedFeatures.includes(feature)}
                    onCheckedChange={(checked) => handleFeatureToggle(feature, checked as boolean)}
                  />
                  <Label htmlFor={feature} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
            {selectedFeatures.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Selecionadas:</span>
                {selectedFeatures.map((feature) => (
                  <Badge key={feature} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
