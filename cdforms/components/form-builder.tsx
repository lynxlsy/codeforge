"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { QuestionCard } from "@/components/question-card"
import { MiniQuestionPanel } from "@/components/mini-question-panel"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus } from "lucide-react"

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

interface FormBuilderProps {
  formData: {
    title: string
    description: string
    questions: Question[]
  }
  setFormData: (data: any) => void
}

export function FormBuilder({ formData, setFormData }: FormBuilderProps) {
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)

  const updateFormField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const addQuestion = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type,
      title: "Pergunta sem título",
      required: false,
      options: type === "multiple-choice" || type === "checkbox" || type === "dropdown" ? ["Opção 1"] : undefined,
      scaleMin: type === "linear-scale" ? 1 : undefined,
      scaleMax: type === "linear-scale" ? 5 : undefined,
      scaleMinLabel: type === "linear-scale" ? "Mínimo" : undefined,
      scaleMaxLabel: type === "linear-scale" ? "Máximo" : undefined,
      rows: type === "multiple-choice-grid" || type === "checkbox-grid" ? ["Linha 1"] : undefined,
      columns: type === "multiple-choice-grid" || type === "checkbox-grid" ? ["Coluna 1"] : undefined,
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    })
    setShowAddQuestion(false)
  }

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setFormData({
      ...formData,
      questions: formData.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q)),
    })
  }

  const deleteQuestion = (questionId: string) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((q) => q.id !== questionId),
    })
  }

  const duplicateQuestion = (questionId: string) => {
    const question = formData.questions.find((q) => q.id === questionId)
    if (question) {
      const duplicated = {
        ...question,
        id: `question-${Date.now()}`,
        title: `${question.title} (cópia)`,
      }
      setFormData({
        ...formData,
        questions: [...formData.questions, duplicated],
      })
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(formData.questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setFormData({
      ...formData,
      questions: items,
    })
  }

  useEffect(() => {
    if (formData.questions.length === 0) {
      const defaultQuestion: Question = {
        id: `question-${Date.now()}`,
        type: "multiple-choice",
        title: "Pergunta sem título",
        required: false,
        options: ["Opção 1"],
      }
      setFormData({
        ...formData,
        questions: [defaultQuestion],
      })
      setActiveQuestionId(defaultQuestion.id)
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4 bg-gray-50 min-h-screen">
      <Card className="shadow-lg border border-gray-900 bg-white rounded-xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-white p-8">
          <Input
            value={formData.title}
            onChange={(e) => updateFormField("title", e.target.value)}
            className="text-2xl font-heading font-bold border-0 p-0 focus-visible:ring-0 bg-transparent text-gray-900 placeholder:text-gray-500"
            placeholder="Título do formulário"
          />
        </CardHeader>
        <CardContent className="p-8 pt-4">
          <Textarea
            value={formData.description}
            onChange={(e) => updateFormField("description", e.target.value)}
            className="border-0 p-0 focus-visible:ring-0 bg-transparent resize-none text-gray-700 text-base font-body placeholder:text-gray-400"
            placeholder="Descrição do formulário"
            rows={3}
          />
        </CardContent>
      </Card>

      {formData.questions.length === 0 && <MiniQuestionPanel onAddQuestion={addQuestion} />}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {formData.questions.map((question, index) => (
                <Draggable key={question.id} draggableId={question.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`transition-all duration-200 ${snapshot.isDragging ? "rotate-1 scale-105 shadow-2xl" : ""}`}
                    >
                      <QuestionCard
                        question={question}
                        onUpdate={(updates) => updateQuestion(question.id, updates)}
                        onDelete={() => deleteQuestion(question.id)}
                        onDuplicate={() => duplicateQuestion(question.id)}
                        onAddQuestion={addQuestion}
                        dragHandleProps={provided.dragHandleProps}
                        isActive={activeQuestionId === question.id}
                        onSetActive={() => setActiveQuestionId(question.id)}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        onClick={() => setShowAddQuestion(!showAddQuestion)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-400 shadow-xl hover:shadow-2xl z-40 transition-all duration-200 hover:scale-110"
        size="icon"
      >
        <Plus className="w-7 h-7 text-white" />
      </Button>
    </div>
  )
}
