"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Question {
  id: string
  type: "multiple-choice" | "checkbox" | "short-text" | "long-text" | "date" | "file-upload"
  title: string
  description?: string
  required: boolean
  options?: string[]
}

interface FormPreviewProps {
  formData: {
    title: string
    description: string
    questions: Question[]
  }
}

export function FormPreview({ formData }: FormPreviewProps) {
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <RadioGroup>
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
              </div>
            ))}
          </div>
        )

      case "short-text":
        return <Input placeholder="Sua resposta" />

      case "long-text":
        return <Textarea placeholder="Sua resposta" rows={4} />

      case "date":
        return <Input type="date" className="w-fit" />

      case "file-upload":
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Button variant="outline">Escolher arquivo</Button>
            <p className="text-sm text-gray-500 mt-2">ou arraste e solte aqui</p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Form Header */}
      <Card className="shadow-md border-0 bg-white">
        <CardHeader className="border-l-4 border-primary">
          <h1 className="text-2xl font-heading font-semibold text-gray-900">{formData.title}</h1>
        </CardHeader>
        {formData.description && (
          <CardContent>
            <p className="text-gray-600">{formData.description}</p>
          </CardContent>
        )}
      </Card>

      {/* Questions */}
      {formData.questions.map((question) => (
        <Card key={question.id} className="shadow-md border-0 bg-white">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {question.description && <p className="text-sm text-gray-600">{question.description}</p>}
            </div>

            {renderQuestion(question)}
          </CardContent>
        </Card>
      ))}

      {/* Submit Button */}
      <div className="flex justify-start">
        <Button className="bg-primary hover:bg-accent px-8">Enviar</Button>
      </div>
    </div>
  )
}
