"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mail, Save, TestTube, CheckCircle, AlertCircle } from "lucide-react"
import { useContactConfig } from "@/hooks/use-contact-config"
import { useToast } from "@/hooks/use-toast"

export function SystemSettings() {
  const { config, updateConfig, openWhatsApp, openEmail } = useContactConfig()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveConfig = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Configurações salvas",
        description: "As configurações de contato foram atualizadas com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTestWhatsApp = () => {
    openWhatsApp("Teste de configuração do WhatsApp da CDforge")
    toast({
      title: "Teste enviado",
      description: "Verifique se o WhatsApp abriu corretamente.",
    })
  }

  const handleTestEmail = () => {
    openEmail("Teste de configuração", "Este é um teste da configuração de email da CDforge.")
    toast({
      title: "Teste enviado",
      description: "Verifique se o email abriu corretamente.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Configurações do Sistema</h1>
        <p className="text-gray-400">Gerencie as configurações globais da CDforge</p>
      </div>

      {/* Configurações de Contato */}
      <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <MessageCircle className="mr-2 h-5 w-5 text-red-400" />
            Configurações de Contato
          </CardTitle>
          <CardDescription className="text-gray-400">
            Configure os links de contato que serão usados em todo o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-white text-sm flex items-center">
              <MessageCircle className="mr-2 h-4 w-4 text-green-400" />
              Link do WhatsApp
            </Label>
            <div className="flex gap-2">
              <Input
                id="whatsapp"
                type="url"
                placeholder="https://wa.me/5511999999999"
                value={config.whatsappLink}
                onChange={(e) => updateConfig({ whatsappLink: e.target.value })}
                className="flex-1 bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestWhatsApp}
                className="border-green-600/30 text-green-400 hover:bg-green-600/10"
              >
                <TestTube className="h-4 w-4 mr-1" />
                Testar
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Formato: https://wa.me/5511999999999 (substitua pelo seu número)
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-sm flex items-center">
              <Mail className="mr-2 h-4 w-4 text-blue-400" />
              Email de Contato
            </Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="contato@cdforge.dev"
                value={config.email}
                onChange={(e) => updateConfig({ email: e.target.value })}
                className="flex-1 bg-black/50 border-red-600/20 text-white placeholder:text-gray-400"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestEmail}
                className="border-blue-600/30 text-blue-400 hover:bg-blue-600/10"
              >
                <TestTube className="h-4 w-4 mr-1" />
                Testar
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Email principal para contato com clientes
            </p>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4 pt-4 border-t border-red-600/20">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm text-gray-400">Configurações ativas</span>
            </div>
            <Badge variant="outline" className="border-green-600/30 text-green-400">
              Sincronizado
            </Badge>
          </div>

          {/* Botão Salvar */}
          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Informações */}
      <Card className="bg-black/30 border-blue-600/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">ℹ️ Como funciona</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-400">
            <p>
              <strong>• Sincronização Automática:</strong> As configurações são salvas automaticamente e sincronizadas em todo o sistema.
            </p>
            <p>
              <strong>• Botões Funcionais:</strong> Os botões "Abrir WhatsApp" e "Baixar PDF" agora funcionam com estas configurações.
            </p>
            <p>
              <strong>• Persistência:</strong> As configurações são salvas no navegador e persistem entre sessões.
            </p>
            <p>
              <strong>• Teste:</strong> Use os botões "Testar" para verificar se os links estão funcionando corretamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
