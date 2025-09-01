"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckSquare,
  Circle,
  Type,
  AlignLeft,
  Calendar,
  Upload,
  ChevronDown,
  BarChart3,
  Star,
  Grid3X3,
  Clock,
} from "lucide-react"

interface AddQuestionButtonProps {
  onAddQuestion: (
    type:
      | "short-text"
      | "paragraph"
      | "multiple-choice"
      | "checkbox"
      | "dropdown"
      | "file-upload"
      | "linear-scale"
      | "rating"
      | "multiple-choice-grid"
      | "checkbox-grid"
      | "date"
      | "time",
  ) => void
}

export function AddQuestionButton({ onAddQuestion }: AddQuestionButtonProps) {
  const questionTypes = [
    {
      type: "short-text" as const,
      label: "Resposta curta",
      icon: Type,
      description: "Texto em uma linha",
    },
    {
      type: "paragraph" as const,
      label: "Parágrafo",
      icon: AlignLeft,
      description: "Texto longo",
    },
    {
      type: "multiple-choice" as const,
      label: "Múltipla escolha",
      icon: Circle,
      description: "Escolha uma opção",
    },
    {
      type: "checkbox" as const,
      label: "Caixas de seleção",
      icon: CheckSquare,
      description: "Escolha várias opções",
    },
    {
      type: "dropdown" as const,
      label: "Lista suspensa",
      icon: ChevronDown,
      description: "Menu suspenso",
    },
    {
      type: "file-upload" as const,
      label: "Upload de arquivo",
      icon: Upload,
      description: "Enviar arquivo",
    },
    {
      type: "linear-scale" as const,
      label: "Escala linear",
      icon: BarChart3,
      description: "Escala numérica",
    },
    {
      type: "rating" as const,
      label: "Classificação",
      icon: Star,
      description: "Avaliação por estrelas",
      isNew: true,
    },
    {
      type: "multiple-choice-grid" as const,
      label: "Grade de múltipla escolha",
      icon: Grid3X3,
      description: "Matriz de opções",
    },
    {
      type: "checkbox-grid" as const,
      label: "Grade da caixa de seleção",
      icon: Grid3X3,
      description: "Matriz de checkboxes",
    },
    {
      type: "date" as const,
      label: "Data",
      icon: Calendar,
      description: "Selecionar data",
    },
    {
      type: "time" as const,
      label: "Horário",
      icon: Clock,
      description: "Selecionar horário",
    },
  ]

  return (
    <Card className="shadow-lg border-0 bg-white rounded-xl overflow-hidden">
      <CardContent className="p-8">
        <h3 className="text-xl font-heading font-bold mb-6 text-gray-800 flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
          Adicionar pergunta
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {questionTypes.map((type) => {
            const Icon = type.icon
            return (
              <Button
                key={type.type}
                variant="outline"
                onClick={() => onAddQuestion(type.type)}
                className="h-auto p-5 flex flex-col items-center gap-3 hover:bg-blue-50 hover:border-blue-300 border-gray-200 transition-all duration-200 hover:shadow-md relative group"
              >
                {type.isNew && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    Novo
                  </div>
                )}
                <Icon className="w-7 h-7 text-blue-500 group-hover:text-blue-600 transition-colors" />
                <div className="text-center">
                  <div className="font-semibold text-sm text-gray-800 mb-1">{type.label}</div>
                  <div className="text-xs text-gray-500 leading-tight">{type.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
