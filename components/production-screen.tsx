"use client"

import { useState, useEffect } from "react"
import { ParticlesBackground } from "@/components/particles-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Settings,
  Play,
  Pause,
  Square,
  RotateCcw,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react"

interface ProductionScreenProps {
  onBackToMain: () => void
}

export function ProductionScreen({ onBackToMain }: ProductionScreenProps) {
  const [isRunning, setIsRunning] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)
  const [totalSteps] = useState(4)

  const steps = [
    { name: "Inicializando", description: "Preparando ambiente de produção" },
    { name: "Processando", description: "Executando tarefas principais" },
    { name: "Otimizando", description: "Aplicando melhorias e ajustes" },
    { name: "Finalizando", description: "Concluindo processo" }
  ]

  useEffect(() => {
    if (isRunning && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => {
          const newProgress = prev + 1
          if (newProgress >= 100) {
            setIsRunning(false)
            return 100
          }
          return newProgress
        })
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [progress, isRunning])

  useEffect(() => {
    const stepProgress = Math.floor((progress / 100) * totalSteps)
    setCurrentStep(Math.min(stepProgress + 1, totalSteps))
  }, [progress, totalSteps])

  const handlePause = () => setIsRunning(false)
  const handleResume = () => setIsRunning(true)
  const handleStop = () => {
    setIsRunning(false)
    setProgress(0)
    setCurrentStep(1)
  }
  const handleRestart = () => {
    setIsRunning(true)
    setProgress(0)
    setCurrentStep(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <ParticlesBackground particleCount={20} />

      {/* Header */}
      <header className="relative z-10 bg-black/80 backdrop-blur-xl border-b border-gray-800 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                Tela de Produção
              </h1>
              <p className="text-xs text-green-400 hidden sm:block">Processo em execução</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 w-full sm:w-auto">
            <Button
              onClick={onBackToMain}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-gray-600/30 text-gray-400 hover:bg-gray-600/10 hover:text-gray-300"
            >
              <Settings className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Voltar</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Status Principal */}
        <Card className="bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-700/50 backdrop-blur-sm mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-200 flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                Status do Processo
              </CardTitle>
              <Badge className={`${isRunning ? 'bg-green-500' : 'bg-gray-500'}`}>
                {isRunning ? 'Em Execução' : 'Pausado'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Barra de Progresso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Progresso Geral</span>
                  <span className="text-gray-200 font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center justify-center space-x-3 pt-4">
                {isRunning ? (
                  <Button
                    onClick={handlePause}
                    size="sm"
                    className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border border-yellow-600/30"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                ) : (
                  <Button
                    onClick={handleResume}
                    size="sm"
                    className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border border-green-600/30"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Continuar
                  </Button>
                )}
                
                <Button
                  onClick={handleStop}
                  size="sm"
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Parar
                </Button>
                
                <Button
                  onClick={handleRestart}
                  size="sm"
                  className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-600/30"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reiniciar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Etapas do Processo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, index) => (
            <Card 
              key={index}
              className={`border backdrop-blur-sm transition-all duration-300 ${
                index + 1 === currentStep
                  ? 'bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-600/30'
                  : index + 1 < currentStep
                  ? 'bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-600/30'
                  : 'bg-gradient-to-br from-gray-800/20 to-gray-900/20 border-gray-700/50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index + 1 === currentStep
                      ? 'bg-green-600/20 text-green-400'
                      : index + 1 < currentStep
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'bg-gray-700/50 text-gray-400'
                  }`}>
                    {index + 1 < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : index + 1 === currentStep ? (
                      <Clock className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      index + 1 === currentStep
                        ? 'text-green-300'
                        : index + 1 < currentStep
                        ? 'text-blue-300'
                        : 'text-gray-400'
                    }`}>
                      {step.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Informações Adicionais */}
        <Card className="bg-gradient-to-br from-gray-800/20 to-gray-900/20 border border-gray-700/50 backdrop-blur-sm mt-6">
          <CardHeader>
            <CardTitle className="text-gray-200 text-sm">Informações do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">Tempo Ativo:</span>
                <span className="text-gray-200 font-medium">00:05:32</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">CPU:</span>
                <span className="text-gray-200 font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                <span className="text-gray-400">Memória:</span>
                <span className="text-gray-200 font-medium">2.1 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


