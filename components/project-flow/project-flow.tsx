"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlatformSelection } from "./platform-selection"
import { ProjectDetails } from "./project-details"
import { QuoteResult } from "./quote-result"

interface Platform {
  id: string
  name: string
  description: string
  basePrice: number
  features: string[]
}

interface ProjectFlowProps {
  category: string
  title: string
  description: string
  platforms: Platform[]
}

export interface ProjectData {
  platform?: Platform
  name: string
  company: string
  contact: string
  contactMethod: "email" | "whatsapp"
  description: string
  features: string[]
  complexity: "basic" | "intermediate" | "advanced"
  timeline: "urgent" | "normal" | "flexible"
}

export function ProjectFlow({ category, title, description, platforms }: ProjectFlowProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState<ProjectData>({
    name: "",
    company: "",
    contact: "",
    contactMethod: "email",
    description: "",
    features: [],
    complexity: "basic",
    timeline: "normal",
  })

  const steps = [
    { id: 1, title: "Plataforma", component: PlatformSelection },
    { id: 2, title: "Detalhes", component: ProjectDetails },
    { id: 3, title: "Orçamento", component: QuoteResult },
  ]

  const currentStepData = steps.find((step) => step.id === currentStep)
  const CurrentComponent = currentStepData?.component

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!projectData.platform
      case 2:
        return projectData.name && projectData.contact && projectData.description
      default:
        return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 project-flow">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif font-black text-4xl md:text-5xl text-foreground mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{description}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                <span
                  className={`ml-2 font-medium ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Content */}
        <div className="max-w-4xl mx-auto">
          {CurrentComponent && (
            <CurrentComponent
              platforms={platforms}
              projectData={projectData}
              setProjectData={setProjectData}
              onNext={handleNext}
            />
          )}
        </div>

        {/* Navigation */}
        {currentStep < 3 && (
          <div className="flex justify-between mt-12 max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center bg-transparent cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={!canProceed()} className="flex items-center cursor-pointer">
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
