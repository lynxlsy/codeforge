"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Users,
  FileText,
  BarChart3,
  Settings,
  ImageIcon,
  Video,
  Upload,
  X,
  Trash2,
  Type,
  Palette,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Copy,
} from "lucide-react"

// Mock data for analytics
const responseData = [
  { day: "Seg", responses: 12 },
  { day: "Ter", responses: 19 },
  { day: "Qua", responses: 8 },
  { day: "Qui", responses: 15 },
  { day: "Sex", responses: 22 },
  { day: "Sáb", responses: 7 },
  { day: "Dom", responses: 5 },
]

const questionTypeData = [
  { name: "Múltipla Escolha", value: 45, color: "#2563eb" },
  { name: "Texto Curto", value: 30, color: "#3b82f6" },
  { name: "Texto Longo", value: 15, color: "#60a5fa" },
  { name: "Número", value: 10, color: "#93c5fd" },
  { name: "Imagem", value: 5, color: "#a5b4fc" },
  { name: "Vídeo", value: 5, color: "#ec4899" },
  { name: "Grade", value: 5, color: "#fbbf24" },
]

interface Question {
  id: string
  title: string
  type: string
  options: string[]
  required: boolean
  uploadedFiles?: File[]
  previewUrls?: string[]
  gridRows?: number
  gridCols?: number
  maxFileSize?: number
  allowedFileTypes?: string[]
  placeholder?: string
  minLength?: number
  maxLength?: number
}

interface FileUploadState {
  isDragging: boolean
  isUploading: boolean
  progress: number
}

export default function FormulariosProfissional() {
  const [formTitle, setFormTitle] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [period, setPeriod] = useState("7d")
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null)
  const [fileUploadStates, setFileUploadStates] = useState<Record<string, FileUploadState>>({})
  const [currentStep, setCurrentStep] = useState<"basic" | "questions" | "build">("basic")
  const [formColor, setFormColor] = useState("#2563eb")
  const [formStyle, setFormStyle] = useState("modern")
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({})

  const [selectedTheme, setSelectedTheme] = useState("blue")

  const [showThemeModal, setShowThemeModal] = useState(false)
  const [isVisualSettingsExpanded, setIsVisualSettingsExpanded] = useState(false)

  const themes = {
    blue: {
      name: "Azul Profissional",
      primary: "#2563eb",
      secondary: "#dbeafe",
      accent: "#1d4ed8",
      gradient: "from-blue-600 to-blue-700",
      bgGradient: "from-blue-50 to-blue-100/50",
      textPrimary: "text-blue-900",
      textSecondary: "text-blue-700",
      border: "border-blue-200",
      ring: "ring-blue-500/20",
    },
    dark: {
      name: "Preto Elegante",
      primary: "#1f2937",
      secondary: "#f3f4f6",
      accent: "#374151",
      gradient: "from-gray-800 to-gray-900",
      bgGradient: "from-gray-100 to-gray-200/50",
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-700",
      border: "border-gray-300",
      ring: "ring-gray-500/20",
    },
    green: {
      name: "Verde Natureza",
      primary: "#059669",
      secondary: "#d1fae5",
      accent: "#047857",
      gradient: "from-emerald-600 to-emerald-700",
      bgGradient: "from-emerald-50 to-emerald-100/50",
      textPrimary: "text-emerald-900",
      textSecondary: "text-emerald-700",
      border: "border-emerald-200",
      ring: "ring-emerald-500/20",
    },
    purple: {
      name: "Roxo Criativo",
      primary: "#7c3aed",
      secondary: "#ede9fe",
      accent: "#6d28d9",
      gradient: "from-violet-600 to-violet-700",
      bgGradient: "from-violet-50 to-violet-100/50",
      textPrimary: "text-violet-900",
      textSecondary: "text-violet-700",
      border: "border-violet-200",
      ring: "ring-violet-500/20",
    },
    orange: {
      name: "Laranja Energético",
      primary: "#ea580c",
      secondary: "#fed7aa",
      accent: "#c2410c",
      gradient: "from-orange-600 to-orange-700",
      bgGradient: "from-orange-50 to-orange-100/50",
      textPrimary: "text-orange-900",
      textSecondary: "text-orange-700",
      border: "border-orange-200",
      ring: "ring-orange-500/20",
    },
    pink: {
      name: "Rosa Suave",
      primary: "#db2777",
      secondary: "#fce7f3",
      accent: "#be185d",
      gradient: "from-pink-600 to-pink-700",
      bgGradient: "from-pink-50 to-pink-100/50",
      textPrimary: "text-pink-900",
      textSecondary: "text-pink-700",
      border: "border-pink-200",
      ring: "ring-pink-500/20",
    },
  }

  const currentTheme = themes[selectedTheme]

  const addQuestion = (type = "text", afterQuestionId?: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      title: "",
      type,
      options: type === "select" ? ["Opção 1", "Opção 2"] : [],
      required: false,
      uploadedFiles: [],
      previewUrls: [],
      gridRows: type === "grid" ? 3 : undefined,
      gridCols: type === "grid" ? 3 : undefined,
      maxFileSize: type === "image" || type === "video" ? 10 : undefined, // 10MB
      allowedFileTypes:
        type === "image"
          ? ["image/jpeg", "image/png", "image/gif", "image/webp"]
          : type === "video"
            ? ["video/mp4", "video/webm", "video/mov"]
            : undefined,
      placeholder: getPlaceholderForType(type),
      minLength: type === "textarea" ? 10 : undefined,
      maxLength: type === "text" ? 100 : type === "textarea" ? 500 : undefined,
    }

    if (afterQuestionId) {
      const index = questions.findIndex((q) => q.id === afterQuestionId)
      const newQuestions = [...questions]
      newQuestions.splice(index + 1, 0, newQuestion)
      setQuestions(newQuestions)
    } else {
      setQuestions([...questions, newQuestion])
    }

    setActiveQuestionId(newQuestion.id)
  }

  const getPlaceholderForType = (type: string): string => {
    switch (type) {
      case "text":
        return "Digite sua resposta aqui..."
      case "textarea":
        return "Escreva uma resposta detalhada..."
      case "email":
        return "exemplo@email.com"
      case "number":
        return "Digite um número..."
      case "image":
        return "Clique ou arraste uma imagem aqui"
      case "video":
        return "Clique ou arraste um vídeo aqui"
      case "grid":
        return "Selecione as opções na grade"
      default:
        return "Digite sua resposta..."
    }
  }

  const handleFileUpload = async (questionId: string, files: FileList | File[]) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const fileArray = Array.from(files)

    // Validate file types and sizes
    const validFiles = fileArray.filter((file) => {
      if (question.allowedFileTypes && !question.allowedFileTypes.includes(file.type)) {
        alert(`Tipo de arquivo não permitido: ${file.type}`)
        return false
      }
      if (question.maxFileSize && file.size > question.maxFileSize * 1024 * 1024) {
        alert(`Arquivo muito grande: ${file.name}. Máximo: ${question.maxFileSize}MB`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Set uploading state
    setFileUploadStates((prev) => ({
      ...prev,
      [questionId]: { isDragging: false, isUploading: true, progress: 0 },
    }))

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setFileUploadStates((prev) => ({
        ...prev,
        [questionId]: { ...prev[questionId], progress: i },
      }))
    }

    // Create preview URLs
    const previewUrls = validFiles.map((file) => URL.createObjectURL(file))

    // Update question with uploaded files
    updateQuestion(questionId, "uploadedFiles", [...(question.uploadedFiles || []), ...validFiles])
    updateQuestion(questionId, "previewUrls", [...(question.previewUrls || []), ...previewUrls])

    // Reset upload state
    setFileUploadStates((prev) => ({
      ...prev,
      [questionId]: { isDragging: false, isUploading: false, progress: 0 },
    }))
  }

  const handleDragOver = (e: React.DragEvent, questionId: string) => {
    e.preventDefault()
    setFileUploadStates((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], isDragging: true },
    }))
  }

  const handleDragLeave = (e: React.DragEvent, questionId: string) => {
    e.preventDefault()
    setFileUploadStates((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], isDragging: false },
    }))
  }

  const handleDrop = (e: React.DragEvent, questionId: string) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    handleFileUpload(questionId, files)
  }

  const removeFile = (questionId: string, fileIndex: number) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const newFiles = question.uploadedFiles?.filter((_, index) => index !== fileIndex) || []
    const newPreviews = question.previewUrls?.filter((_, index) => index !== fileIndex) || []

    updateQuestion(questionId, "uploadedFiles", newFiles)
    updateQuestion(questionId, "previewUrls", newPreviews)
  }

  const addOption = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const newOptions = [...question.options, `Opção ${question.options.length + 1}`]
    updateQuestion(questionId, "options", newOptions)
  }

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    const newOptions = [...question.options]
    newOptions[optionIndex] = value
    updateQuestion(questionId, "options", newOptions)
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question || question.options.length <= 2) return

    const newOptions = question.options.filter((_, index) => index !== optionIndex)
    updateQuestion(questionId, "options", newOptions)
  }

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleQuestionClick = (questionId: string) => {
    setActiveQuestionId(questionId)
  }

  const FloatingToolbar = ({ questionId }: { questionId: string }) => {
    return null
  }

  const renderQuestionContent = (question: Question) => {
    const uploadState = fileUploadStates[question.id] || { isDragging: false, isUploading: false, progress: 0 }

    switch (question.type) {
      case "text":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-gradient-to-r ${currentTheme.gradient} rounded-xl shadow-lg`}>
                <Type className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${currentTheme.textPrimary} text-lg`}>Resposta Curta</h4>
                <p className={`text-sm ${currentTheme.textSecondary}`}>Campo de texto de uma linha</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={question.placeholder || "Resposta curta..."}
                  disabled
                  className={`w-full p-4 border-2 border-dashed ${currentTheme.border}/50 rounded-xl bg-gray-50/50 text-gray-500 transition-all duration-300 hover:border-${currentTheme.primary}/70`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Type className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={`${currentTheme.textPrimary} font-medium mb-2 block`}>Mínimo de caracteres</Label>
                  <Input
                    type="number"
                    value={question.minLength || 0}
                    onChange={(e) => updateQuestion(question.id, { minLength: Number.parseInt(e.target.value) })}
                    className="border-2 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <Label className={`${currentTheme.textPrimary} font-medium mb-2 block`}>Máximo de caracteres</Label>
                  <Input
                    type="number"
                    value={question.maxLength || 100}
                    onChange={(e) => updateQuestion(question.id, { maxLength: Number.parseInt(e.target.value) })}
                    className="border-2 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case "textarea":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-gradient-to-r ${currentTheme.gradient} rounded-xl shadow-lg`}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${currentTheme.textPrimary} text-lg`}>Parágrafo</h4>
                <p className={`text-sm ${currentTheme.textSecondary}`}>Campo de texto de múltiplas linhas</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  placeholder={question.placeholder || "Resposta longa..."}
                  disabled
                  rows={4}
                  className={`w-full p-4 border-2 border-dashed ${currentTheme.border}/50 rounded-xl bg-gray-50/50 text-gray-500 resize-none transition-all duration-300 hover:border-${currentTheme.primary}/70`}
                />
                <div className="absolute right-3 top-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <Label className={`${currentTheme.textPrimary} font-medium mb-2 block`}>Máximo de caracteres</Label>
                <Input
                  type="number"
                  value={question.maxLength || 500}
                  onChange={(e) => updateQuestion(question.id, { maxLength: Number.parseInt(e.target.value) })}
                  className="border-2 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        )

      case "select":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-gradient-to-r ${currentTheme.gradient} rounded-xl shadow-lg`}>
                <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <h4 className={`font-semibold ${currentTheme.textPrimary} text-lg`}>Múltipla Escolha</h4>
                <p className={`text-sm ${currentTheme.textSecondary}`}>Seleção única entre opções</p>
              </div>
            </div>
            <div className="space-y-4">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center gap-3 group">
                  <div className={`w-4 h-4 border-2 ${currentTheme.border} rounded-full flex-shrink-0`}></div>
                  <div className="flex-1 relative">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...question.options]
                        newOptions[index] = e.target.value
                        updateQuestion(question.id, { options: newOptions })
                      }}
                      placeholder={`Opção ${index + 1}`}
                      className="border-2 focus:ring-2 focus:ring-blue-500/20 pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                      onClick={() => {
                        const newOptions = question.options.filter((_, i) => i !== index)
                        updateQuestion(question.id, { options: newOptions })
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newOptions = [...question.options, `Opção ${question.options.length + 1}`]
                  updateQuestion(question.id, { options: newOptions })
                }}
                className={`w-full border-2 border-dashed ${currentTheme.border}/50 hover:border-${currentTheme.primary} hover:bg-${currentTheme.primary}/5 transition-all duration-300`}
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar opção
              </Button>
            </div>
          </div>
        )

      case "image":
      case "video":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 bg-gradient-to-r ${currentTheme.gradient} rounded-xl shadow-lg`}>
                {question.type === "image" ? (
                  <ImageIcon className="w-5 h-5 text-white" />
                ) : (
                  <Video className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h4 className={`font-semibold ${currentTheme.textPrimary} text-lg`}>
                  Upload de {question.type === "image" ? "Imagem" : "Vídeo"}
                </h4>
                <p className={`text-sm ${currentTheme.textSecondary}`}>
                  Permite envio de arquivos {question.type === "image" ? "de imagem" : "de vídeo"}
                </p>
              </div>
            </div>

            {/* Enhanced Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-500 cursor-pointer group overflow-hidden ${
                uploadState.isDragging
                  ? `border-${currentTheme.primary} bg-${currentTheme.primary}/10 scale-105 shadow-2xl`
                  : `${currentTheme.border}/50 hover:border-${currentTheme.primary} hover:bg-${currentTheme.primary}/5 hover:scale-102 hover:shadow-xl`
              }`}
              onDragOver={(e) => handleDragOver(e, question.id)}
              onDragLeave={(e) => handleDragLeave(e, question.id)}
              onDrop={(e) => handleDrop(e, question.id)}
              onClick={(e) => {
                e.stopPropagation()
                fileInputRefs.current[question.id]?.click()
              }}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bgGradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
              ></div>

              {uploadState.isUploading ? (
                <div className="space-y-4 relative z-10">
                  <div
                    className={`w-20 h-20 mx-auto bg-gradient-to-br ${currentTheme.bgGradient} rounded-2xl flex items-center justify-center animate-pulse shadow-lg`}
                  >
                    <Upload className={`w-10 h-10 ${currentTheme.textPrimary} animate-bounce`} />
                  </div>
                  <div className="space-y-3">
                    <p className={`${currentTheme.textPrimary} font-semibold text-lg`}>Fazendo upload...</p>
                    <div className={`w-full bg-${currentTheme.primary}/20 rounded-full h-3 overflow-hidden`}>
                      <div
                        className={`bg-gradient-to-r ${currentTheme.gradient} h-3 rounded-full transition-all duration-300 shadow-sm`}
                        style={{ width: `${uploadState.progress}%` }}
                      />
                    </div>
                    <p className={`text-sm ${currentTheme.textSecondary} font-medium`}>{uploadState.progress}%</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  <div
                    className={`w-20 h-20 mx-auto bg-gradient-to-br ${currentTheme.bgGradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {question.type === "image" ? (
                      <ImageIcon className={`w-10 h-10 ${currentTheme.textPrimary}`} />
                    ) : (
                      <Video className={`w-10 h-10 ${currentTheme.textPrimary}`} />
                    )}
                  </div>
                  <div>
                    <p className={`${currentTheme.textPrimary} font-semibold text-lg mb-2`}>
                      Clique ou arraste {question.type === "image" ? "imagens" : "vídeos"} aqui
                    </p>
                    <p className={`text-sm ${currentTheme.textSecondary}`}>
                      Máximo: {question.maxFileSize || 10}MB • Formatos:{" "}
                      {question.type === "image" ? "JPG, PNG, GIF" : "MP4, MOV, AVI"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={(el) => {
                if (el) fileInputRefs.current[question.id] = el
              }}
              type="file"
              multiple
              accept={question.type === "image" ? "image/*" : "video/*"}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  handleFileUpload(question.id, e.target.files)
                }
              }}
            />

            {/* Enhanced Preview Area */}
            {question.previewUrls && question.previewUrls.length > 0 && (
              <div className="space-y-4">
                <Label className={`${currentTheme.textPrimary} font-semibold text-lg flex items-center gap-2`}>
                  <div className={`p-1 bg-gradient-to-r ${currentTheme.gradient} rounded-lg`}>
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Arquivos Carregados
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {question.previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        {question.type === "image" ? (
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <video src={url} className="w-full h-full object-cover" controls preload="metadata" />
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-8 h-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hover:scale-110"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFile(question.id, index)
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className={`${currentTheme.textPrimary} font-medium mb-2 block`}>Tamanho máximo (MB)</Label>
                <Input
                  type="number"
                  value={question.maxFileSize || 10}
                  onChange={(e) => updateQuestion(question.id, { maxFileSize: Number.parseInt(e.target.value) })}
                  className="border-2 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <Label className={`${currentTheme.textPrimary} font-medium mb-2 block`}>Múltiplos arquivos</Label>
                <Select defaultValue="yes">
                  <SelectTrigger className="border-2 focus:ring-2 focus:ring-blue-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Permitir</SelectItem>
                    <SelectItem value="no">Apenas um</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 bg-gradient-to-r ${currentTheme.gradient} rounded-xl shadow-lg`}>
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className={`font-semibold ${currentTheme.textPrimary} text-lg`}>Configurações Gerais</h4>
                <p className={`text-sm ${currentTheme.textSecondary}`}>Tipo de pergunta: {question.type}</p>
              </div>
            </div>
            <p className={`${currentTheme.textSecondary} text-center py-8`}>
              Configurações para este tipo de pergunta serão exibidas aqui.
            </p>
          </div>
        )
    }
  }

  const duplicateQuestion = (id: string) => {
    const question = questions.find((q) => q.id === id)
    if (!question) return

    const duplicatedQuestion = {
      ...question,
      id: Date.now().toString(),
      title: question.title + " (Cópia)",
    }

    setQuestions((prevQuestions) => {
      const index = prevQuestions.findIndex((q) => q.id === id)
      const newQuestions = [...prevQuestions]
      newQuestions.splice(index + 1, 0, duplicatedQuestion)
      return newQuestions
    })
  }

  const deleteQuestion = (id: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id))
    setActiveQuestionId(null)
  }

  const renderQuestionTypeSpecificContent = (question: Question) => {
    switch (question.type) {
      case "text":
        return <Input type="text" placeholder="Resposta curta" className="w-full" />
      case "textarea":
        return <textarea placeholder="Parágrafo" className="w-full" />
      case "select":
        return (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opção 1</SelectItem>
              <SelectItem value="option2">Opção 2</SelectItem>
            </SelectContent>
          </Select>
        )
      case "checkbox":
        return (
          <div className="space-y-2">
            <div>
              <label className="inline-flex items-center">
                <Input type="checkbox" className="mr-2" />
                <span>Opção 1</span>
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <Input type="checkbox" className="mr-2" />
                <span>Opção 2</span>
              </label>
            </div>
          </div>
        )
      case "dropdown":
        return (
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Opção 1</SelectItem>
              <SelectItem value="option2">Opção 2</SelectItem>
            </SelectContent>
          </Select>
        )
      case "image":
        return <Input type="file" accept="image/*" className="w-full" />
      case "video":
        return <Input type="file" accept="video/*" className="w-full" />
      case "date":
        return <Input type="date" className="w-full" />
      case "time":
        return <Input type="time" className="w-full" />
      default:
        return <p>Tipo de pergunta não suportado</p>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-200/50 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              Sistema de Formulários
            </h1>
          </div>
        </div>
      </header>

      {showThemeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-300">
          <div className="bg-white rounded-3xl shadow-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-500">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-blue-900">Temas Predefinidos</h2>
                    <p className="text-blue-600 mt-1">Escolha um tema para personalizar seu formulário</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowThemeModal(false)}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(themes).map(([key, theme]) => (
                  <div
                    key={key}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      selectedTheme === key
                        ? "border-blue-500 bg-blue-50 shadow-lg ring-4 ring-blue-500/20"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedTheme(key)
                      setShowThemeModal(false)
                    }}
                  >
                    {selectedTheme === key && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full shadow-md" style={{ backgroundColor: theme.primary }} />
                      <div className="w-8 h-8 rounded-full shadow-md" style={{ backgroundColor: theme.accent }} />
                    </div>

                    <h3 className="font-bold text-lg text-gray-900 mb-2">{theme.name}</h3>

                    <div className="space-y-2">
                      <div className="h-3 rounded-full" style={{ backgroundColor: theme.primary }} />
                      <div className="h-2 rounded-full w-3/4" style={{ backgroundColor: theme.secondary }} />
                      <div className="h-2 rounded-full w-1/2" style={{ backgroundColor: theme.accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-md border border-blue-200/50 shadow-lg rounded-xl p-1">
            <TabsTrigger
              value="create"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-blue-50"
            >
              <Settings className="w-4 h-4 mr-2" />
              Criar Formulário
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-blue-50"
            >
              <Users className="w-4 h-4 mr-2" />
              Respostas
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-700 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-blue-50"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Tela 1: Criação de Formulários */}
          <TabsContent value="create" className="space-y-6 animate-in fade-in-50 duration-500">
            {currentStep === "basic" ? (
              // Tela Inicial - Configurações Básicas
              <div className="space-y-8">
                <div className="text-center mb-12">
                  <h2
                    className={`text-5xl font-bold bg-gradient-to-r ${currentTheme.gradient} bg-clip-text text-transparent mb-4`}
                  >
                    Criar Novo Formulário
                  </h2>
                  <p className={`${currentTheme.textSecondary} text-xl`}>
                    Configure as informações básicas do seu formulário
                  </p>
                </div>

                {/* Informações Básicas */}
                <Card
                  className={`${currentTheme.border}/50 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white/95 backdrop-blur-lg hover:scale-[1.02] hover:-translate-y-2 animate-in slide-in-from-bottom-6 duration-1000`}
                >
                  <CardHeader className={`bg-gradient-to-r ${currentTheme.bgGradient} text-center py-12 rounded-t-lg`}>
                    <div className="flex justify-center mb-6">
                      <div
                        className={`p-4 bg-gradient-to-r ${currentTheme.gradient} rounded-2xl shadow-xl hover:scale-110 transition-transform duration-300`}
                      >
                        <Settings className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <CardTitle className={`${currentTheme.textPrimary} text-3xl mb-2`}>
                      Informações do Formulário
                    </CardTitle>
                    <CardDescription className={`${currentTheme.textSecondary} text-lg`}>
                      Configure título e descrição do seu formulário
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-10 space-y-10">
                    {/* Título do Formulário */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-gradient-to-r ${currentTheme.gradient} rounded-lg`}>
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <label className={`text-lg font-bold ${currentTheme.textPrimary}`}>Título do Formulário</label>
                      </div>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Ex: Pesquisa de Satisfação do Cliente"
                        className={`w-full p-5 border-2 border-transparent bg-gradient-to-r from-white to-white rounded-2xl shadow-lg focus:scale-[1.02] focus:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:${currentTheme.ring} text-lg`}
                        style={{
                          background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent}) border-box`,
                        }}
                      />
                      <p className={`${currentTheme.textSecondary} text-sm`}>
                        Este será o título principal exibido no topo do formulário
                      </p>
                    </div>

                    {/* Descrição do Formulário */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-gradient-to-r ${currentTheme.gradient} rounded-lg`}>
                          <Type className="w-5 h-5 text-white" />
                        </div>
                        <label className={`text-lg font-bold ${currentTheme.textPrimary}`}>
                          Descrição do Formulário
                        </label>
                      </div>
                      <textarea
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Descreva o objetivo e contexto do formulário para orientar os respondentes..."
                        rows={5}
                        className={`w-full p-5 border-2 border-transparent bg-gradient-to-r from-white to-white rounded-2xl shadow-lg focus:scale-[1.02] focus:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:${currentTheme.ring} resize-none text-lg`}
                        style={{
                          background: `linear-gradient(white, white) padding-box, linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent}) border-box`,
                        }}
                      />
                      <p className={`${currentTheme.textSecondary} text-sm`}>
                        Uma descrição clara ajuda os usuários a entenderem o propósito do formulário
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => setIsVisualSettingsExpanded(!isVisualSettingsExpanded)}
                        className={`w-full p-4 rounded-2xl border-2 ${currentTheme.border}/50 bg-gradient-to-br ${currentTheme.bgGradient} hover:scale-[1.02] hover:shadow-lg transition-all duration-300 group flex items-center justify-between`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 bg-gradient-to-r ${currentTheme.gradient} rounded-lg`}>
                            <Palette className="w-5 h-5 text-white" />
                          </div>
                          <span className={`text-lg font-bold ${currentTheme.textPrimary}`}>Personalização Visual</span>
                        </div>
                        <div
                          className={`p-2 ${currentTheme.textSecondary} group-hover:scale-110 transition-transform duration-300`}
                        >
                          {isVisualSettingsExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      {isVisualSettingsExpanded && (
                        <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                          {/* Botão Personalizar Tema */}
                          <div className="space-y-4">
                            <button
                              onClick={() => setShowThemeModal(true)}
                              className={`w-full p-6 rounded-2xl border-2 ${currentTheme.border}/50 bg-gradient-to-br ${currentTheme.bgGradient} hover:scale-[1.02] hover:shadow-xl transition-all duration-300 group`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="flex gap-2">
                                    <div
                                      className="w-6 h-6 rounded-full shadow-md"
                                      style={{ backgroundColor: currentTheme.primary }}
                                    />
                                    <div
                                      className="w-6 h-6 rounded-full shadow-md"
                                      style={{ backgroundColor: currentTheme.accent }}
                                    />
                                  </div>
                                  <div className="text-left">
                                    <h3 className={`font-bold ${currentTheme.textPrimary} text-lg`}>
                                      {currentTheme.name}
                                    </h3>
                                    <p className={`${currentTheme.textSecondary} text-sm`}>
                                      Clique para escolher outro tema
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className={`p-2 bg-gradient-to-r ${currentTheme.gradient} rounded-lg group-hover:scale-110 transition-transform duration-300`}
                                >
                                  <Palette className="w-5 h-5 text-white" />
                                </div>
                              </div>
                            </button>
                          </div>

                          {/* Preview do Formulário */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 bg-gradient-to-r ${currentTheme.gradient} rounded-lg`}>
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <label className={`text-lg font-bold ${currentTheme.textPrimary}`}>
                                Preview do Formulário
                              </label>
                            </div>

                            <div
                              className={`p-8 rounded-2xl border-2 ${currentTheme.border}/30 bg-gradient-to-br ${currentTheme.bgGradient}`}
                            >
                              <div className="text-center space-y-4">
                                <h3 className={`text-2xl font-bold ${currentTheme.textPrimary}`}>
                                  {formTitle || "Título do Formulário"}
                                </h3>
                                <p className={`${currentTheme.textSecondary}`}>
                                  {formDescription || "Descrição do formulário aparecerá aqui..."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end pt-6">
                      <Button
                        onClick={() => setCurrentStep("questions")}
                        className={`px-8 py-4 bg-gradient-to-r ${currentTheme.gradient} hover:scale-105 hover:shadow-xl transition-all duration-300 text-lg font-semibold rounded-2xl`}
                        disabled={!formTitle.trim()}
                      >
                        Próximo: Adicionar Perguntas
                        <Plus className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : currentStep === "questions" ? (
              // Tela de Perguntas
              <div className="space-y-8">
                <div
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${currentTheme.bgGradient} p-8 ${currentTheme.border} border backdrop-blur-sm`}
                >
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${currentTheme.gradient} shadow-lg`}>
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h2 className={`text-4xl font-bold ${currentTheme.textPrimary} mb-2`}>Adicionar Perguntas</h2>
                          <p className={`${currentTheme.textSecondary} text-lg`}>
                            Configure perguntas e tipos de resposta para seu formulário
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-6">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentTheme.gradient}`}></div>
                        <span className={`${currentTheme.textSecondary} text-sm font-medium`}>
                          {questions.length} pergunta{questions.length !== 1 ? "s" : ""} adicionada
                          {questions.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("basic")}
                      className={`${currentTheme.border} hover:${currentTheme.ring} transition-all duration-300 hover:scale-105`}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  </div>
                </div>

                {/* Enhanced Questions List */}
                <div className="space-y-6">
                  {questions.length === 0 ? (
                    <div className="text-center py-16">
                      <div
                        className={`w-24 h-24 mx-auto bg-gradient-to-br ${currentTheme.bgGradient} rounded-3xl flex items-center justify-center mb-6 shadow-xl`}
                      >
                        <Plus className={`w-12 h-12 ${currentTheme.textPrimary}`} />
                      </div>
                      <h3 className={`text-2xl font-bold ${currentTheme.textPrimary} mb-3`}>Nenhuma pergunta ainda</h3>
                      <p className={`${currentTheme.textSecondary} text-lg mb-8`}>
                        Comece adicionando sua primeira pergunta ao formulário
                      </p>
                      <Button
                        onClick={() => addQuestion()}
                        className={`bg-gradient-to-r ${currentTheme.gradient} hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-4 text-lg font-semibold`}
                      >
                        <Plus className="w-5 h-5 mr-2" />
                        Adicionar Primeira Pergunta
                      </Button>
                    </div>
                  ) : (
                    <>
                      {questions.map((question, index) => (
                        <Card
                          key={question.id}
                          className={`group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 ${
                            activeQuestionId === question.id
                              ? `ring-4 ring-${currentTheme.primary}/30 shadow-2xl scale-[1.02] -translate-y-1`
                              : "shadow-lg"
                          } bg-white/95 backdrop-blur-lg border-2 ${currentTheme.border}/30`}
                          onClick={() => setActiveQuestionId(activeQuestionId === question.id ? null : question.id)}
                        >
                          {/* Animated background gradient */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${currentTheme.bgGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                          ></div>

                          <CardHeader
                            className={`relative z-10 bg-gradient-to-r ${currentTheme.bgGradient} py-4 border-b-2 ${currentTheme.border}/20`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                {/* Enhanced Question Number */}
                                <div
                                  className={`w-12 h-12 bg-gradient-to-r ${currentTheme.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                >
                                  <span className="text-white font-bold text-lg">{index + 1}</span>
                                </div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Input
                                      value={question.title}
                                      onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
                                      placeholder={`Pergunta ${index + 1}`}
                                      className={`text-lg font-semibold ${currentTheme.textPrimary} border-none bg-transparent p-0 focus:ring-0 focus:outline-none`}
                                      onClick={(e) => e.stopPropagation()}
                                    />

                                    {/* Enhanced Question Type Badge */}
                                    <div
                                      className={`px-3 py-1 bg-gradient-to-r ${currentTheme.gradient} rounded-full shadow-md`}
                                    >
                                      <span className="text-white text-xs font-semibold uppercase tracking-wide">
                                        {question.type === "text" && "Texto Curto"}
                                        {question.type === "textarea" && "Parágrafo"}
                                        {question.type === "select" && "Múltipla Escolha"}
                                        {question.type === "image" && "Upload Imagem"}
                                        {question.type === "video" && "Upload Vídeo"}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Question Type Selector */}
                                  <Select
                                    value={question.type}
                                    onValueChange={(value) => updateQuestion(question.id, { type: value })}
                                  >
                                    <SelectTrigger
                                      className="w-48 border-2 focus:ring-2 focus:ring-blue-500/20"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="text">📝 Resposta curta</SelectItem>
                                      <SelectItem value="textarea">📄 Parágrafo</SelectItem>
                                      <SelectItem value="select">⚪ Múltipla escolha</SelectItem>
                                      <SelectItem value="checkbox">☑️ Caixas de seleção</SelectItem>
                                      <SelectItem value="image">🖼️ Upload de imagem</SelectItem>
                                      <SelectItem value="video">🎥 Upload de vídeo</SelectItem>
                                      <SelectItem value="date">📅 Data</SelectItem>
                                      <SelectItem value="time">🕐 Horário</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Enhanced Action Buttons */}
                              <div className="flex items-center gap-2">
                                {/* Required Toggle */}
                                <Button
                                  variant={question.required ? "default" : "outline"}
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    updateQuestion(question.id, { required: !question.required })
                                  }}
                                  className={`transition-all duration-300 ${
                                    question.required
                                      ? `bg-gradient-to-r ${currentTheme.gradient} hover:scale-110 shadow-lg`
                                      : `hover:scale-110 hover:shadow-md border-2 ${currentTheme.border}/50`
                                  }`}
                                >
                                  <span className="text-xs font-semibold">
                                    {question.required ? "OBRIGATÓRIA" : "OPCIONAL"}
                                  </span>
                                </Button>

                                {/* Duplicate Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    duplicateQuestion(question.id)
                                  }}
                                  className={`hover:scale-110 transition-all duration-300 hover:shadow-md border-2 ${currentTheme.border}/50 hover:bg-${currentTheme.primary}/5`}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>

                                {/* Delete Button */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteQuestion(question.id)
                                  }}
                                  className="hover:scale-110 transition-all duration-300 hover:shadow-md border-2 border-red-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>

                          {/* Enhanced Question Content */}
                          {activeQuestionId === question.id && (
                            <CardContent className="relative z-10 p-8 animate-in slide-in-from-top-4 duration-500">
                              {renderQuestionContent(question)}
                            </CardContent>
                          )}
                        </Card>
                      ))}

                      {/* Enhanced Add Question Button */}
                      <div className="text-center py-8">
                        <Button
                          onClick={() => addQuestion()}
                          className={`bg-gradient-to-r ${currentTheme.gradient} hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-4 text-lg font-semibold rounded-2xl`}
                        >
                          <Plus className="w-6 h-6 mr-3" />
                          Adicionar Nova Pergunta
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end pt-6">
                  <Button
                    onClick={() => setCurrentStep("build")}
                    className={`px-8 py-4 bg-gradient-to-r ${currentTheme.gradient} hover:scale-105 hover:shadow-xl transition-all duration-300 text-lg font-semibold rounded-2xl`}
                    disabled={questions.length === 0}
                  >
                    Próximo: Construir Formulário
                    <Plus className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center py-16">
                  <h2 className={`text-4xl font-bold ${currentTheme.textPrimary} mb-4`}>Construir Formulário</h2>
                  <p className={`${currentTheme.textSecondary} text-lg`}>Funcionalidade em desenvolvimento</p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Tela 2: Respostas */}
          <TabsContent value="responses" className="space-y-6 animate-in fade-in-50 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Respostas</CardTitle>
                <CardDescription>Visualização e gerenciamento das respostas do formulário.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Em breve: Funcionalidade para visualizar e gerenciar as respostas do formulário.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tela 3: Analytics */}
          <TabsContent value="analytics" className="space-y-6 animate-in fade-in-50 duration-500">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Análise de dados e estatísticas do formulário.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Gráfico de Respostas por Dia */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-4">Respostas por Dia</h3>
                    <div className="flex items-end justify-around h-40">
                      {responseData.map((item, index) => (
                        <div key={index} className="text-center">
                          <div
                            className="bg-blue-500 rounded-md"
                            style={{ height: `${item.responses * 3}px`, width: "20px" }}
                          />
                          <p className="text-xs mt-1">{item.day}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gráfico de Tipos de Pergunta */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <h3 className="text-lg font-semibold mb-4">Tipos de Pergunta</h3>
                    <div className="relative h-40">
                      {questionTypeData.map((item, index) => {
                        const angle = (item.value / 100) * 360
                        const startAngle = questionTypeData
                          .slice(0, index)
                          .reduce((sum, q) => sum + (q.value / 100) * 360, 0)
                        const x = 50 + 40 * Math.cos(((startAngle + angle / 2) * Math.PI) / 180)
                        const y = 50 + 40 * Math.sin(((startAngle + angle / 2) * Math.PI) / 180)

                        return (
                          <React.Fragment key={index}>
                            <circle
                              cx="50%"
                              cy="50%"
                              r="40%"
                              fill={item.color}
                              stroke="white"
                              strokeWidth="2"
                              style={{
                                strokeDasharray: `${(item.value / 100) * 251.33} ${251.33}`,
                                strokeDashoffset: `${251.33 - (startAngle / 360) * 251.33}`,
                                transformOrigin: "center",
                                transform: "rotate(-90deg)",
                                transition: "stroke-dashoffset 0.3s ease",
                              }}
                            />
                            <text
                              x={`${x}%`}
                              y={`${y}%`}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fontSize="10"
                              fill="white"
                              style={{ pointerEvents: "none" }}
                            >
                              {item.name}
                            </text>
                          </React.Fragment>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Período de Análise */}
                <div className="mt-6">
                  <Label htmlFor="period">Período de Análise:</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Selecionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Últimos 7 dias</SelectItem>
                      <SelectItem value="30d">Últimos 30 dias</SelectItem>
                      <SelectItem value="90d">Últimos 90 dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
