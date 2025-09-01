"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Type,
  AlignLeft,
  Circle,
  CheckSquare,
  ChevronDown,
  Upload,
  BarChart3,
  Star,
  Grid3X3,
  Calendar,
  Clock,
} from "lucide-react"

interface QuestionTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectType: (type: string) => void
}

export function QuestionTypeModal({ isOpen, onClose, onSelectType }: QuestionTypeModalProps) {
  const questionTypes = [
    {
      type: "short-text",
      title: "Resposta curta",
      description: "Texto em uma linha",
      icon: Type,
    },
    {
      type: "paragraph",
      title: "Parágrafo",
      description: "Texto longo",
      icon: AlignLeft,
    },
    {
      type: "multiple-choice",
      title: "Múltipla escolha",
      description: "Escolha uma opção",
      icon: Circle,
    },
    {
      type: "checkbox",
      title: "Caixas de seleção",
      description: "Escolha várias opções",
      icon: CheckSquare,
    },
    {
      type: "dropdown",
      title: "Lista suspensa",
      description: "Menu suspenso",
      icon: ChevronDown,
    },
    {
      type: "file-upload",
      title: "Upload de arquivo",
      description: "Enviar arquivo",
      icon: Upload,
    },
    {
      type: "linear-scale",
      title: "Escala linear",
      description: "Escala numérica",
      icon: BarChart3,
    },
    {
      type: "rating",
      title: "Classificação",
      description: "Avaliação por estrelas",
      icon: Star,
      isNew: true,
    },
    {
      type: "multiple-choice-grid",
      title: "Grade de múltipla escolha",
      description: "Matriz de opções",
      icon: Grid3X3,
    },
    {
      type: "checkbox-grid",
      title: "Grade da caixa de seleção",
      description: "Matriz de checkboxes",
      icon: Grid3X3,
      highlighted: true,
    },
    {
      type: "date",
      title: "Data",
      description: "Selecionar data",
      icon: Calendar,
    },
    {
      type: "time",
      title: "Horário",
      description: "Selecionar horário",
      icon: Clock,
    },
  ]

  const handleSelectType = (type: string) => {
    onSelectType(type)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-600 border-l-4 border-blue-500 pl-3">
            Adicionar pergunta
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-4 mt-6">
          {questionTypes.map((questionType) => (
            <Button
              key={questionType.type}
              variant="outline"
              className={`h-24 flex flex-col items-center justify-center gap-2 p-4 relative hover:shadow-md transition-all duration-200 ${
                questionType.highlighted
                  ? "border-blue-300 bg-blue-50 hover:bg-blue-100"
                  : "hover:border-blue-300 hover:bg-blue-50"
              }`}
              onClick={() => handleSelectType(questionType.type)}
            >
              {questionType.isNew && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Novo
                </span>
              )}

              <questionType.icon className="w-6 h-6 text-blue-600" />

              <div className="text-center">
                <div className="font-semibold text-sm text-gray-800">{questionType.title}</div>
                <div className="text-xs text-gray-500 mt-1">{questionType.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
