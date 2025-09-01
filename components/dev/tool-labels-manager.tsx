"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToolLabelBadge } from "@/components/ui/tool-label"
import { useToolLabels, ToolLabel } from "@/hooks/use-tool-labels"
import { Edit, Trash2, Save, X, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Lista de ferramentas existentes
const existingTools = [
  // Plataformas de Download
  "Spotify", "TikTok", "YouTube", "Instagram", "Pinterest", "Discord", "WhatsApp", "Telegram",
  // Conversores
  "PNG → PDF", "JPG → PDF", "PNG → SVG", "JPG → PNG", "PDF → DOCX", "MP4 → MP3", "WAV → MP3",
  // Ferramentas
  "Removedor de Fundo"
]

export function ToolLabelsManager() {
  const { labels, loading, createLabel, updateLabel, deleteLabel } = useToolLabels()
  const [editingLabel, setEditingLabel] = useState<ToolLabel | null>(null)
  const [newLabel, setNewLabel] = useState({
    name: "",
    status: "development" as ToolLabel['status'],
    description: ""
  })

  const getColorForStatus = (status: ToolLabel['status']) => {
    switch (status) {
      case 'development': return '#3B82F6' // Azul
      case 'available': return '#10B981' // Verde
      case 'premium': return '#8B5CF6' // Roxo
      case 'beta': return '#F59E0B' // Amarelo
      default: return '#3B82F6'
    }
  }

  const handleCreateLabel = async () => {
    if (!newLabel.name.trim()) return
    
    try {
      await createLabel({
        ...newLabel,
        color: getColorForStatus(newLabel.status)
      })
      setNewLabel({
        name: "",
        status: "development",
        description: ""
      })
    } catch (error) {
      console.error('Erro ao criar etiqueta:', error)
    }
  }

  const handleUpdateLabel = async () => {
    if (!editingLabel) return
    
    try {
      await updateLabel(editingLabel.id, {
        name: editingLabel.name,
        status: editingLabel.status,
        color: getColorForStatus(editingLabel.status),
        description: editingLabel.description
      })
      setEditingLabel(null)
    } catch (error) {
      console.error('Erro ao atualizar etiqueta:', error)
    }
  }

  const handleDeleteLabel = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta etiqueta?')) return
    
    try {
      await deleteLabel(id)
    } catch (error) {
      console.error('Erro ao excluir etiqueta:', error)
    }
  }

  const getLabelForTool = (toolName: string): ToolLabel | undefined => {
    return labels.find(label => label.name === toolName)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando etiquetas...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Adicionar Etiqueta para Ferramenta Existente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Tag className="w-5 h-5 mr-2" />
            Adicionar Etiqueta a Ferramenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tool-select">Selecionar Ferramenta</Label>
              <Select
                value={newLabel.name}
                onValueChange={(value) => setNewLabel({ ...newLabel, name: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma ferramenta" />
                </SelectTrigger>
                <SelectContent>
                  {existingTools.map((tool) => {
                    const hasLabel = getLabelForTool(tool)
                    return (
                      <SelectItem 
                        key={tool} 
                        value={tool}
                        disabled={hasLabel !== undefined}
                        className={hasLabel ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {tool} {hasLabel && "(já tem etiqueta)"}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newLabel.status}
                onValueChange={(value: ToolLabel['status']) => 
                  setNewLabel({ ...newLabel, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Em Desenvolvimento</SelectItem>
                  <SelectItem value="available">Disponível</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="beta">Beta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={newLabel.description}
              onChange={(e) => setNewLabel({ ...newLabel, description: e.target.value })}
              placeholder="Descrição opcional"
            />
          </div>
          <Button 
            onClick={handleCreateLabel} 
            className="w-full"
            disabled={!newLabel.name}
          >
            <Tag className="w-4 h-4 mr-2" />
            Adicionar Etiqueta
          </Button>
        </CardContent>
      </Card>

      {/* Lista de Ferramentas com Etiquetas */}
      <Card>
        <CardHeader>
          <CardTitle>Ferramentas e suas Etiquetas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {existingTools.map((toolName) => {
              const label = getLabelForTool(toolName)
              return (
                <div key={toolName} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-200 truncate">{toolName}</h3>
                    </div>
                    {label ? (
                      <ToolLabelBadge label={label} />
                    ) : (
                      <Badge variant="outline" className="text-gray-500 border-gray-600">
                        Sem etiqueta
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {label ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingLabel(label)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteLabel(label.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setNewLabel({ ...newLabel, name: toolName })}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Tag className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      {editingLabel && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Etiqueta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Ferramenta</Label>
                <Input
                  id="edit-name"
                  value={editingLabel.name}
                  disabled
                  className="bg-gray-800/50"
                />
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingLabel.status}
                  onValueChange={(value: ToolLabel['status']) => 
                    setEditingLabel({ ...editingLabel, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Em Desenvolvimento</SelectItem>
                    <SelectItem value="available">Disponível</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Input
                id="edit-description"
                value={editingLabel.description || ""}
                onChange={(e) => setEditingLabel({ ...editingLabel, description: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUpdateLabel} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setEditingLabel(null)}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
