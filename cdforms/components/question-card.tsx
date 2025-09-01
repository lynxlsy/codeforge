"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GripVertical, Trash2, Copy, ImageIcon, Plus, X, Star, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MiniQuestionPanel } from "@/components/mini-question-panel"

interface Question {
  id: string
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
    | "time"
  title: string
  description?: string
  required: boolean
  options?: string[]
  scaleMin?: number
  scaleMax?: number
  scaleMinLabel?: string
  scaleMaxLabel?: string
  rows?: string[]
  columns?: string[]
}

interface QuestionCardProps {
  question: Question
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
  onDuplicate: () => void
  onAddQuestion: (type: string) => void // Added onAddQuestion prop
  dragHandleProps?: any
  isActive?: boolean
  onSetActive?: () => void
}

export function QuestionCard({
  question,
  onUpdate,
  onDelete,
  onDuplicate,
  onAddQuestion,
  dragHandleProps,
  isActive = false,
  onSetActive,
}: QuestionCardProps) {
  const [isEditing, setIsEditing] = useState(false)

  const questionTypes = [
    { value: "short-text", label: "Resposta curta" },
    { value: "paragraph", label: "Parágrafo" },
    { value: "multiple-choice", label: "Múltipla escolha" },
    { value: "checkbox", label: "Caixas de seleção" },
    { value: "dropdown", label: "Lista suspensa" },
    { value: "file-upload", label: "Upload de arquivo" },
    { value: "linear-scale", label: "Escala linear" },
    { value: "rating", label: "Classificação" },
    { value: "multiple-choice-grid", label: "Grade de múltipla escolha" },
    { value: "checkbox-grid", label: "Grade da caixa de seleção" },
    { value: "date", label: "Data" },
    { value: "time", label: "Horário" },
  ]

  const addOption = () => {
    const currentOptions = question.options || []
    onUpdate({
      options: [...currentOptions, `Opção ${currentOptions.length + 1}`],
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(question.options || [])]
    newOptions[index] = value
    onUpdate({ options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = question.options?.filter((_, i) => i !== index)
    onUpdate({ options: newOptions })
  }

  const addRow = () => {
    const currentRows = question.rows || []
    onUpdate({
      rows: [...currentRows, `Linha ${currentRows.length + 1}`],
    })
  }

  const updateRow = (index: number, value: string) => {
    const newRows = [...(question.rows || [])]
    newRows[index] = value
    onUpdate({ rows: newRows })
  }

  const removeRow = (index: number) => {
    const newRows = question.rows?.filter((_, i) => i !== index)
    onUpdate({ rows: newRows })
  }

  const addColumn = () => {
    const currentColumns = question.columns || []
    onUpdate({
      columns: [...currentColumns, `Coluna ${currentColumns.length + 1}`],
    })
  }

  const updateColumn = (index: number, value: string) => {
    const newColumns = [...(question.columns || [])]
    newColumns[index] = value
    onUpdate({ columns: newColumns })
  }

  const removeColumn = (index: number) => {
    const newColumns = question.columns?.filter((_, i) => i !== index)
    onUpdate({ columns: newColumns })
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case "multiple-choice":
      case "checkbox":
      case "dropdown":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 ${question.type === "checkbox" ? "rounded border-2" : "rounded-full border-2"} border-blue-400 flex-shrink-0`}
                />
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  className="flex-1 border-2 border-gray-200 focus:border-blue-500 rounded-lg"
                  placeholder={`Opção ${index + 1}`}
                />
                {question.options && question.options.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="text-gray-400 hover:text-red-500 border border-transparent hover:border-red-200"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={addOption}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-lg font-medium"
              >
                <Plus className="w-4 h-4" />
                Adicionar uma opção
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg font-medium"
              >
                Adicionar "Outro"
              </Button>
            </div>
          </div>
        )
      case "short-text":
        return <Input placeholder="Resposta curta" disabled className="bg-gray-50 border-gray-200" />
      case "paragraph":
        return <Textarea placeholder="Resposta longa" disabled className="bg-gray-50 border-gray-200" rows={3} />
      case "date":
        return <Input type="date" disabled className="bg-gray-50 border-gray-200 w-fit" />
      case "time":
        return <Input type="time" disabled className="bg-gray-50 border-gray-200 w-fit" />
      case "file-upload":
        return (
          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center bg-blue-50">
            <p className="text-blue-600 font-medium">Adicionar arquivo</p>
          </div>
        )
      case "linear-scale":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">De:</label>
                <Input
                  type="number"
                  value={question.scaleMin || 1}
                  onChange={(e) => onUpdate({ scaleMin: Number.parseInt(e.target.value) })}
                  className="w-20"
                  min="0"
                  max="10"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Até:</label>
                <Input
                  type="number"
                  value={question.scaleMax || 5}
                  onChange={(e) => onUpdate({ scaleMax: Number.parseInt(e.target.value) })}
                  className="w-20"
                  min="2"
                  max="10"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Input
                value={question.scaleMinLabel || ""}
                onChange={(e) => onUpdate({ scaleMinLabel: e.target.value })}
                placeholder="Rótulo mínimo (opcional)"
                className="w-40"
              />
              <div className="flex gap-2">
                {Array.from({ length: (question.scaleMax || 5) - (question.scaleMin || 1) + 1 }, (_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-blue-300 flex items-center justify-center text-sm"
                  >
                    {(question.scaleMin || 1) + i}
                  </div>
                ))}
              </div>
              <Input
                value={question.scaleMaxLabel || ""}
                onChange={(e) => onUpdate({ scaleMaxLabel: e.target.value })}
                placeholder="Rótulo máximo (opcional)"
                className="w-40"
              />
            </div>
          </div>
        )
      case "rating":
        return (
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2 text-gray-500">Classificação por estrelas</span>
          </div>
        )
      case "multiple-choice-grid":
      case "checkbox-grid":
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Linhas</h4>
              {question.rows?.map((row, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={row}
                    onChange={(e) => updateRow(index, e.target.value)}
                    className="flex-1 border-gray-200"
                    placeholder={`Linha ${index + 1}`}
                  />
                  {question.rows && question.rows.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                onClick={addRow}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
              >
                <Plus className="w-4 h-4" />
                Adicionar linha
              </Button>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800">Colunas</h4>
              {question.columns?.map((column, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Input
                    value={column}
                    onChange={(e) => updateColumn(index, e.target.value)}
                    className="flex-1 border-gray-200"
                    placeholder={`Coluna ${index + 1}`}
                  />
                  {question.columns && question.columns.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeColumn(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="ghost"
                onClick={addColumn}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
              >
                <Plus className="w-4 h-4" />
                Adicionar coluna
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div>
      <Card
        className={`shadow-lg border-2 bg-white hover:shadow-xl transition-all duration-200 rounded-xl overflow-hidden cursor-pointer ${
          isActive ? "border-blue-500 shadow-xl" : "border-gray-200 hover:border-blue-300"
        }`}
        onClick={onSetActive}
      >
        <CardHeader
          className={`flex flex-row items-start justify-between space-y-0 pb-4 border-l-4 ${
            isActive
              ? "bg-gradient-to-r from-blue-100 to-blue-50 border-blue-600"
              : "bg-gradient-to-r from-blue-50 to-white border-blue-500"
          }`}
        >
          <div className="flex items-start gap-3 flex-1">
            <div
              {...dragHandleProps}
              className="cursor-grab active:cursor-grabbing mt-1 hover:text-blue-500 transition-colors"
            >
              <GripVertical className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1 space-y-3">
              <Input
                value={question.title || "Crie sua pergunta"}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="text-lg font-bold border-0 border-b-2 border-gray-300 rounded-none p-0 focus-visible:ring-0 focus-visible:border-blue-500 bg-transparent font-heading"
                placeholder="Crie sua pergunta"
              />
              {question.description !== undefined && (
                <Textarea
                  value={question.description}
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  className="border-0 p-0 focus-visible:ring-0 bg-transparent resize-none text-sm text-gray-600 font-body"
                  placeholder="Descrição (opcional)"
                  rows={1}
                />
              )}
            </div>
          </div>
          <Select value={question.type} onValueChange={(value) => onUpdate({ type: value as Question["type"] })}>
            <SelectTrigger className="w-52 border-2 border-gray-200 focus:border-blue-500 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {questionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="space-y-4 p-6 border-t-2 border-gray-100">
          {renderQuestionInput()}

          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg font-medium"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Adicionar imagem
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={question.required}
                  onCheckedChange={(checked) => onUpdate({ required: checked })}
                  className="data-[state=checked]:bg-blue-500"
                />
                <span className="text-sm text-gray-700 font-semibold">Obrigatória</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDuplicate}
                  className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-lg font-medium px-3"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Duplicar card
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg font-medium px-3"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir card
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg p-2"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="text-gray-600">Configurações avançadas</DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-600">Validação personalizada</DropdownMenuItem>
                    <DropdownMenuItem className="text-gray-600">Lógica condicional</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {isActive && <MiniQuestionPanel onAddQuestion={onAddQuestion} />}
    </div>
  )
}
