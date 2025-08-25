"use client"

import { useState } from "react"
import { Check, Clock, Send, Download, MessageCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { calculateQuote, getCurrentPricing } from "@/lib/pricing"
import { useOrders } from "@/hooks/use-orders"
import { useContactConfig } from "@/hooks/use-contact-config"
import { PDFGenerator } from "@/lib/pdf-generator"
import type { ProjectData } from "./project-flow"

interface QuoteResultProps {
  platforms: any[]
  projectData: ProjectData
  setProjectData: (data: ProjectData) => void
  onNext: () => void
}

export function QuoteResult({ projectData }: QuoteResultProps) {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [pdfFileName, setPdfFileName] = useState<string>("")
  const { submitOrder, loading } = useOrders()
  const { openWhatsApp, getWhatsAppNumber, getTelegramNumber } = useContactConfig()
  const quote = calculateQuote(projectData)
  
  // Obter o range de preços atual do sistema dinâmico
  const getPriceRange = () => {
    if (!projectData.platform) return null
    
    const pricingData = getCurrentPricing()
    const platformId = projectData.platform.id
    
    // Mapear plataforma para categoria
    const platformToCategory: Record<string, string> = {
      discord: 'bots', instagram: 'bots', whatsapp: 'bots', telegram: 'bots', custom: 'bots',
      landing: 'sites', ecommerce: 'sites', portfolio: 'sites', corporate: 'sites', webapp: 'sites',
      api: 'personalizados', integration: 'personalizados', automation: 'personalizados', 
      consulting: 'personalizados', maintenance: 'personalizados'
    }
    
    const category = platformToCategory[platformId]
    if (!category || !pricingData[category as keyof typeof pricingData]) return null
    
    const categoryData = pricingData[category as keyof typeof pricingData]
    const pricing = (categoryData as any)[platformId]
    
    return pricing ? { min: pricing.min, max: pricing.max } : null
  }
  
  const priceRange = getPriceRange()

  const handleConfirmProject = async () => {
    try {
      // Preparar dados do projeto para o Firebase
      const orderData = {
        client: projectData.name,
        email: projectData.contact, // Sempre salvar o contato, independente do método
        platform: projectData.platform?.id as any,
        description: projectData.description,
        features: projectData.features,
        complexity: projectData.complexity,
        timeline: projectData.timeline,
        price: quote.finalPrice,
        date: new Date().toISOString(),
        contactMethod: projectData.contactMethod,
        status: "pending" as const,
        ...(projectData.company && { notes: `Empresa: ${projectData.company}` })
      }

      // Enviar pedido
      const result = await submitOrder(orderData)
      
      if (result.success && result.fileName) {
        setIsSubmitted(true)
        setPdfFileName(result.fileName)
      }
    } catch (error) {
      console.error('Erro ao confirmar projeto:', error)
    }
  }

  const handleOpenWhatsApp = () => {
    const message = `Olá! Gostaria de enviar o comprovante do projeto "${projectData.name}" para análise.`
    openWhatsApp(message)
  }

  const handleDownloadPDFAgain = async () => {
    try {
      // Preparar dados do projeto para gerar o PDF novamente
      const orderData = {
        id: `temp-${Date.now()}`,
        client: projectData.name,
        email: projectData.contact, // Sempre salvar o contato, independente do método
        platform: projectData.platform?.id as any,
        description: projectData.description,
        features: projectData.features,
        complexity: projectData.complexity,
        timeline: projectData.timeline,
        price: quote.finalPrice,
        date: new Date().toISOString(),
        contactMethod: projectData.contactMethod,
        status: "pending" as const,
        ...(projectData.company && { notes: `Empresa: ${projectData.company}` })
      }

      // Gerar e baixar o PDF
      await PDFGenerator.generateOrderPDF(orderData)
    } catch (error) {
      console.error('Erro ao baixar PDF novamente:', error)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h2 className="font-serif font-bold text-2xl md:text-3xl mb-4 text-green-600">
            Pedido Enviado com Sucesso!
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Seu comprovante foi baixado automaticamente. Envie-o para o WhatsApp da CDforge para prosseguirmos com o projeto.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="font-semibold mb-4">📋 Próximos Passos:</h3>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li className="flex items-start">
              <span className="mr-2">1.</span>
              <span>Envie o PDF "{pdfFileName}" para o WhatsApp da CDforge</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">2.</span>
              <span>Aguarde nossa análise e confirmação (até 2h úteis)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">3.</span>
              <span>Receberá um cronograma detalhado de desenvolvimento</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">4.</span>
              <span>Iniciaremos o desenvolvimento após aprovação</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={handleOpenWhatsApp}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Abrir WhatsApp
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={handleDownloadPDFAgain}
          >
            <Download className="mr-2 h-4 w-4" />
            Baixar PDF Novamente
          </Button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-blue-800">
            <strong>💡 Dica:</strong> O comprovante contém todas as informações do seu projeto. 
            Mantenha-o salvo para referência futura.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-serif font-bold text-2xl md:text-3xl mb-4">Seu Orçamento</h2>
        <p className="text-muted-foreground">Baseado nas informações fornecidas</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Quote Summary */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">Resumo do Orçamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-serif font-black text-primary mb-2">R$ {quote.finalPrice.toFixed(0)}</div>
              <p className="text-muted-foreground">Valor estimado</p>
              {priceRange && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Range configurado: R$ {priceRange.min} - R$ {priceRange.max}
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Valor base ({projectData.platform?.name})</span>
                <span className="font-medium">R$ {quote.basePrice}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Complexidade ({projectData.complexity})</span>
                <span className="font-medium">+{((quote.complexityMultiplier - 1) * 100).toFixed(0)}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Funcionalidades extras</span>
                <span className="font-medium">+R$ {quote.featuresPrice}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Prazo ({projectData.timeline})</span>
                <span className="font-medium">
                  {quote.timelineMultiplier > 1 ? "+" : ""}
                  {((quote.timelineMultiplier - 1) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-center space-x-2 text-green-600">
              <Clock className="h-4 w-4" />
              <span className="font-medium">Prazo: {quote.estimatedDays} dias</span>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detalhes do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Plataforma Selecionada</h4>
              <Badge variant="secondary" className="text-sm">
                {projectData.platform?.name}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Informações de Contato</h4>
              <div className="text-sm space-y-1">
                <p>
                  <span className="font-medium">Nome:</span> {projectData.name}
                </p>
                {projectData.company && (
                  <p>
                    <span className="font-medium">Empresa:</span> {projectData.company}
                  </p>
                )}
                <p>
                  <span className="font-medium">{projectData.contactMethod === "email" ? "E-mail:" : "WhatsApp:"}</span>{" "}
                  {projectData.contact}
                </p>
              </div>
            </div>

            {projectData.features.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Funcionalidades Selecionadas</h4>
                <div className="flex flex-wrap gap-1">
                  {projectData.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Descrição</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{projectData.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notificação simples sobre variação de preço */}
      <div className="flex justify-center">
        <div className="bg-blue-500 border border-blue-600 rounded-full px-4 py-2 text-white text-sm flex items-center gap-2">
          <span className="text-blue-100">💡</span>
          <span>Preço pode variar conforme complexidade</span>
        </div>
      </div>

      {/* Important Notes */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-3 text-blue-900">📋 O que acontece ao confirmar:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Seu pedido será salvo em nosso sistema</li>
            <li>• Um PDF será gerado automaticamente com todos os detalhes</li>
            <li>• O PDF deve ser enviado para o WhatsApp da CDforge</li>
            <li>• Entraremos em contato em até 2 horas úteis</li>
            <li>• O projeto aparecerá na área administrativa para acompanhamento</li>
          </ul>
        </CardContent>
      </Card>

      {/* Confirm Button */}
      <div className="text-center">
        <Button 
          onClick={handleConfirmProject} 
          size="lg" 
          className="text-lg px-8 py-6"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processando...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Confirmar Solicitação
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          {loading 
            ? "Gerando PDF e salvando pedido..." 
            : "Ao confirmar, você receberá um PDF para enviar no WhatsApp"
          }
        </p>
      </div>
    </div>
  )
}
