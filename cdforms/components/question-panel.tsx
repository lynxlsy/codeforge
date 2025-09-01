"use client"

import { Button } from "@/components/ui/button"
import { Plus, FileText, Type, ImageIcon, Play, Grid3X3 } from "lucide-react"

interface QuestionPanelProps {
  onAddQuestion: (type: string) => void
}

export function QuestionPanel({ onAddQuestion }: QuestionPanelProps) {
  const panelItems = [
    {
      icon: Plus,
      label: "Adicionar pergunta",
      action: () => onAddQuestion("multiple-choice"),
      className:
        "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md",
    },
    {
      icon: FileText,
      label: "Adicionar seção",
      action: () => onAddQuestion("section"),
      className: "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm",
    },
    {
      icon: Type,
      label: "Adicionar texto",
      action: () => onAddQuestion("text-block"),
      className: "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm",
    },
    {
      icon: ImageIcon,
      label: "Adicionar imagem",
      action: () => onAddQuestion("image-block"),
      className: "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm",
    },
    {
      icon: Play,
      label: "Adicionar vídeo",
      action: () => onAddQuestion("video-block"),
      className: "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm",
    },
    {
      icon: Grid3X3,
      label: "Adicionar grade",
      action: () => onAddQuestion("grid-block"),
      className: "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 shadow-sm",
    },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto mt-6">
      <div className="bg-gradient-to-r from-blue-50 to-white border-2 border-gray-200 rounded-xl shadow-lg p-4 hover:shadow-xl hover:border-blue-300 transition-all duration-200">
        <div className="flex flex-wrap gap-3 justify-center">
          {panelItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={item.action}
              className={`w-12 h-12 p-0 rounded-xl transition-all duration-200 ${item.className}`}
              title={item.label}
            >
              <item.icon className="w-5 h-5" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
