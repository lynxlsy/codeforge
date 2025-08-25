"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, TrendingUp, Calculator, Package, Zap, Edit, Save, X, DollarSign } from "lucide-react"
import type { PlatformPricing, ComplexityMultiplier, ServicePlan } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { getCurrentPricing, updateDynamicPricing, loadPricingFromFirebase, subscribeToPricingChanges } from "@/lib/pricing"

// Dados das categorias do sistema
const categoryData = {
  bots: {
    name: "Bots",
    platforms: [
      { id: "discord", name: "Discord Bot", description: "Bots para servidores Discord" },
      { id: "instagram", name: "Instagram Bot", description: "Automação para Instagram" },
      { id: "whatsapp", name: "WhatsApp Bot", description: "Chatbots para WhatsApp Business" },
      { id: "telegram", name: "Telegram Bot", description: "Bots para Telegram" },
      { id: "custom", name: "Sistema", description: "Automação customizada" }
    ]
  },
  sites: {
    name: "Sites",
    platforms: [
      { id: "landing", name: "Landing Page", description: "Página de conversão" },
      { id: "ecommerce", name: "E-commerce", description: "Loja virtual completa" },
      { id: "portfolio", name: "Portfólio", description: "Site profissional" },
      { id: "corporate", name: "Site Corporativo", description: "Presença digital" },
      { id: "webapp", name: "Aplicação Web", description: "Sistema web personalizado" }
    ]
  },
  personalizados: {
    name: "Serviços Personalizados",
    platforms: [
      { id: "api", name: "API Personalizada", description: "APIs REST ou GraphQL" },
      { id: "integration", name: "Integrações", description: "Conecte sistemas" },
      { id: "automation", name: "Automação de Processos", description: "Automatize tarefas" },
      { id: "consulting", name: "Consultoria Técnica", description: "Orientação especializada" },
      { id: "maintenance", name: "Manutenção e Suporte", description: "Manutenção contínua" }
    ]
  }
}

// Dados iniciais de preços (carregados do sistema de pricing)
const initialPricingData = getCurrentPricing()

// Multiplicadores de complexidade
const complexityMultipliers = [
  { complexity: "basic", name: "Básico", multiplier: 0.8, description: "Projetos simples" },
  { complexity: "intermediate", name: "Intermediário", multiplier: 1.0, description: "Projetos moderados" },
  { complexity: "advanced", name: "Avançado", multiplier: 1.5, description: "Projetos complexos" }
]

export function PricingManager() {
  const [pricingData, setPricingData] = useState(initialPricingData)
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null)
  const [tempMin, setTempMin] = useState<number>(0)
  const [tempMax, setTempMax] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSynchronized, setIsSynchronized] = useState(false)
  const { toast } = useToast()

  // Carregar preços do Firebase quando o componente montar
  useEffect(() => {
    const loadPricing = async () => {
      setIsLoading(true)
      await loadPricingFromFirebase()
      setPricingData(getCurrentPricing())
      setIsLoading(false)
      setIsSynchronized(true)
    }
    
    loadPricing()
  }, [])

  // Escutar mudanças em tempo real
  useEffect(() => {
    const unsubscribe = subscribeToPricingChanges((newPricingData) => {
      setPricingData(newPricingData)
      setIsSynchronized(true)
    })

    return () => unsubscribe()
  }, [])

  const handleEditPricing = (category: string, platform: string) => {
    setEditingCategory(category)
    setEditingPlatform(platform)
    setTempMin(pricingData[category as keyof typeof pricingData][platform as keyof typeof pricingData[typeof category]].min)
    setTempMax(pricingData[category as keyof typeof pricingData][platform as keyof typeof pricingData[typeof category]].max)
  }

  const handleSavePricing = async () => {
    if (editingCategory && editingPlatform) {
      const updatedPricingData = {
        ...pricingData,
        [editingCategory]: {
          ...pricingData[editingCategory as keyof typeof pricingData],
          [editingPlatform]: {
            min: tempMin,
            max: tempMax
          }
        }
      }

      setPricingData(updatedPricingData)

      // Sincronizar com o Firebase
      const success = await updateDynamicPricing(updatedPricingData)

      if (success) {
        toast({
          title: "✅ Preços atualizados",
          description: `Preços de ${categoryData[editingCategory as keyof typeof categoryData].name} - ${editingPlatform} foram salvos no Firebase e sincronizados em tempo real.`,
        })
      } else {
        toast({
          title: "❌ Erro ao salvar",
          description: "Não foi possível salvar os preços no Firebase. Tente novamente.",
          variant: "destructive"
        })
      }

      setEditingCategory(null)
      setEditingPlatform(null)
    }
  }

  const handleSaveAllPricing = async () => {
    setIsLoading(true)
    setIsSynchronized(false)
    
    try {
      // Sincronizar todos os preços atuais com o Firebase
      const success = await updateDynamicPricing(pricingData)

      if (success) {
        setIsSynchronized(true)
        toast({
          title: "✅ Sincronização Completa",
          description: "Todos os preços foram salvos no Firebase e sincronizados globalmente em tempo real.",
        })
      } else {
        toast({
          title: "❌ Erro na Sincronização",
          description: "Não foi possível sincronizar os preços. Verifique a conexão e tente novamente.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Erro ao sincronizar preços:", error)
      toast({
        title: "❌ Erro na Sincronização",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePriceRange = (category: string, platform: string) => {
    const basePricing = pricingData[category as keyof typeof pricingData][platform as keyof typeof pricingData[typeof category]]
    
    return {
      basic: {
        min: Math.round(basePricing.min * 0.8),
        max: Math.round(basePricing.max * 0.8)
      },
      intermediate: {
        min: Math.round(basePricing.min * 1.0),
        max: Math.round(basePricing.max * 1.0)
      },
      advanced: {
        min: Math.round(basePricing.min * 1.5),
        max: Math.round(basePricing.max * 1.5)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gerenciador de Preços</h1>
            <p className="text-gray-400">Configure preços mínimos e máximos para cada categoria e plataforma</p>
          </div>
          <div className="flex items-center gap-3">
            {isSynchronized && !isLoading && (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Sincronizado</span>
              </div>
            )}
            <Button
              onClick={handleSaveAllPricing}
              disabled={isLoading}
              className={`cursor-pointer ${
                isSynchronized 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Sincronizando..." : "Salvar e Sincronizar"}
            </Button>
          </div>
        </div>
        {isLoading && (
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
            <div className="flex items-center gap-2 text-blue-300">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
              <span>Carregando preços do Firebase...</span>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="bots" className="space-y-6">
        <TabsList className="bg-gray-800/50 border border-gray-700">
          <TabsTrigger
            value="bots"
            className="cursor-pointer data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors"
          >
            🤖 Bots
          </TabsTrigger>
          <TabsTrigger
            value="sites"
            className="cursor-pointer data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors"
          >
            🌐 Sites
          </TabsTrigger>
          <TabsTrigger
            value="personalizados"
            className="cursor-pointer data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors"
          >
            🔧 Personalizados
          </TabsTrigger>
          <TabsTrigger
            value="calculator"
            className="cursor-pointer data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-300 hover:text-white transition-colors"
          >
            🧮 Calculadora
          </TabsTrigger>
        </TabsList>

        {/* Tab Bots */}
        <TabsContent value="bots" className="space-y-6">
          <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Package className="mr-2 h-5 w-5 text-red-400" />
                Preços - Bots
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure os preços mínimos e máximos para cada tipo de bot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData.bots.platforms.map((platform) => {
                  const pricing = pricingData.bots[platform.id as keyof typeof pricingData.bots]
                  const priceRanges = calculatePriceRange('bots', platform.id)
                  
                  return (
                    <Card key={platform.id} className="bg-gray-900/50 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg">{platform.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">{platform.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Preço Base:</span>
                          <div className="text-right">
                            <div className="text-white font-semibold">R$ {pricing.min} - R$ {pricing.max}</div>
                            <div className="text-gray-400 text-xs">Min - Max</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-green-400">Básico:</span>
                            <span className="text-white">R$ {priceRanges.basic.min} - R$ {priceRanges.basic.max}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-yellow-400">Intermediário:</span>
                            <span className="text-white">R$ {priceRanges.intermediate.min} - R$ {priceRanges.intermediate.max}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-red-400">Avançado:</span>
                            <span className="text-white">R$ {priceRanges.advanced.min} - R$ {priceRanges.advanced.max}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleEditPricing('bots', platform.id)}
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Preços
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Sites */}
        <TabsContent value="sites" className="space-y-6">
          <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Package className="mr-2 h-5 w-5 text-red-400" />
                Preços - Sites
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure os preços mínimos e máximos para cada tipo de site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData.sites.platforms.map((platform) => {
                  const pricing = pricingData.sites[platform.id as keyof typeof pricingData.sites]
                  const priceRanges = calculatePriceRange('sites', platform.id)
                  
                  return (
                    <Card key={platform.id} className="bg-gray-900/50 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg">{platform.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">{platform.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Preço Base:</span>
                          <div className="text-right">
                            <div className="text-white font-semibold">R$ {pricing.min} - R$ {pricing.max}</div>
                            <div className="text-gray-400 text-xs">Min - Max</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-green-400">Básico:</span>
                            <span className="text-white">R$ {priceRanges.basic.min} - R$ {priceRanges.basic.max}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-yellow-400">Intermediário:</span>
                            <span className="text-white">R$ {priceRanges.intermediate.min} - R$ {priceRanges.intermediate.max}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-red-400">Avançado:</span>
                            <span className="text-white">R$ {priceRanges.advanced.min} - R$ {priceRanges.advanced.max}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleEditPricing('sites', platform.id)}
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Preços
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Personalizados */}
        <TabsContent value="personalizados" className="space-y-6">
          <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Package className="mr-2 h-5 w-5 text-red-400" />
                Preços - Serviços Personalizados
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure os preços mínimos e máximos para cada serviço personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryData.personalizados.platforms.map((platform) => {
                  const pricing = pricingData.personalizados[platform.id as keyof typeof pricingData.personalizados]
                  const priceRanges = calculatePriceRange('personalizados', platform.id)
                  
                  return (
                    <Card key={platform.id} className="bg-gray-900/50 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg">{platform.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">{platform.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">Preço Base:</span>
                          <div className="text-right">
                            <div className="text-white font-semibold">R$ {pricing.min} - R$ {pricing.max}</div>
                            <div className="text-gray-400 text-xs">Min - Max</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-green-400">Básico:</span>
                            <span className="text-white">R$ {priceRanges.basic.min} - R$ {priceRanges.basic.max}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-yellow-400">Intermediário:</span>
                            <span className="text-white">R$ {priceRanges.intermediate.min} - R$ {priceRanges.intermediate.max}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-red-400">Avançado:</span>
                            <span className="text-white">R$ {priceRanges.advanced.min} - R$ {priceRanges.advanced.max}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleEditPricing('personalizados', platform.id)}
                          size="sm"
                          className="w-full bg-red-600 hover:bg-red-700 cursor-pointer"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar Preços
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Calculadora */}
        <TabsContent value="calculator" className="space-y-6">
          <Card className="bg-black/30 border-red-600/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-red-400" />
                Calculadora de Preços
              </CardTitle>
              <CardDescription className="text-gray-400">
                Visualize como os preços são calculados com base na complexidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {complexityMultipliers.map((complexity) => (
                    <Card key={complexity.complexity} className="bg-gray-900/50 border-gray-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-white text-lg">{complexity.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">{complexity.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">{complexity.multiplier}x</div>
                          <div className="text-gray-400 text-sm">Multiplicador</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Como funciona:</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• <strong>Preço Base:</strong> Definido por categoria e plataforma</li>
                    <li>• <strong>Complexidade:</strong> Multiplica o preço base (0.8x a 1.5x)</li>
                    <li>• <strong>Resultado:</strong> Preço final sempre dentro do range min-max</li>
                    <li>• <strong>Projetos simples:</strong> Tendem ao preço mínimo</li>
                    <li>• <strong>Projetos complexos:</strong> Tendem ao preço máximo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Edição */}
      <Dialog open={editingCategory !== null} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              Editar Preços - {editingCategory && categoryData[editingCategory as keyof typeof categoryData]?.name} - {editingPlatform}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min-price" className="text-gray-300">Preço Mínimo (R$)</Label>
                <Input
                  id="min-price"
                  type="number"
                  value={tempMin}
                  onChange={(e) => setTempMin(Number(e.target.value))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="max-price" className="text-gray-300">Preço Máximo (R$)</Label>
                <Input
                  id="max-price"
                  type="number"
                  value={tempMax}
                  onChange={(e) => setTempMax(Number(e.target.value))}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-3">
              <h4 className="text-blue-300 font-semibold mb-2">Preview dos Preços:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-400">Básico:</span>
                  <span className="text-white">R$ {Math.round(tempMin * 0.8)} - R$ {Math.round(tempMax * 0.8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-400">Intermediário:</span>
                  <span className="text-white">R$ {tempMin} - R$ {tempMax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">Avançado:</span>
                  <span className="text-white">R$ {Math.round(tempMin * 1.5)} - R$ {Math.round(tempMax * 1.5)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setEditingCategory(null)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button
                onClick={handleSavePricing}
                className="bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
