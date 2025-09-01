"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Type, FileText, ImageIcon, Video, Grid3X3 } from "lucide-react"
import { QuestionTypeModal } from "./question-type-modal"

interface MiniQuestionPanelProps {
  onAddQuestion: (type: string) => void
}

export function MiniQuestionPanel({ onAddQuestion }: MiniQuestionPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const panelItems = [
    { icon: Plus, label: "Adicionar pergunta", action: () => setIsModalOpen(true) },
    { icon: FileText, label: "Seção", action: () => onAddQuestion("paragraph") },
    { icon: Type, label: "Texto", action: () => onAddQuestion("short-text") },
    { icon: ImageIcon, label: "Imagem", action: () => onAddQuestion("file-upload") },
    { icon: Video, label: "Vídeo", action: () => onAddQuestion("file-upload") },
    { icon: Grid3X3, label: "Grade", action: () => onAddQuestion("multiple-choice-grid") },
  ]

  return (
    <>
      <div className="flex justify-center mt-4">
        <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-2 flex gap-1">
          {panelItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={item.action}
              className="w-8 h-8 p-0 hover:bg-blue-50 hover:text-blue-600 text-gray-500 transition-colors"
              title={item.label}
            >
              <item.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>
      </div>

      <QuestionTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSelectType={onAddQuestion} />
    </>
  )
}
