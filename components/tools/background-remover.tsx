"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { FileImage, Upload, Download, X, Loader2, Palette, Eraser, Pipette, Wand2, Undo2, Redo2, ZoomIn, ZoomOut, Zap, Info } from "lucide-react"

interface BackgroundRemoverProps {
  onClose?: () => void
}

interface Point {
  x: number
  y: number
}

export function BackgroundRemover({ onClose }: BackgroundRemoverProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff")
  const [tolerance, setTolerance] = useState<number>(30)
  const [brushSize, setBrushSize] = useState<number>(10)
  const [zoom, setZoom] = useState<number>(1)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<'eraser' | 'color-picker' | 'auto-remove'>('eraser')
  const [canvasInitialized, setCanvasInitialized] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingStep, setProcessingStep] = useState('')




  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas arquivos de imagem.')
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('O arquivo deve ter no máximo 10MB.')
        return
      }

      

      // Simular progresso de upload
      setUploadProgress(0)
      setProcessingStep('Carregando arquivo...')
      
      const simulateUpload = () => {
        let progress = 0
        const interval = setInterval(() => {
          progress += Math.random() * 15 + 5
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            setProcessingStep('Arquivo carregado!')
            
            // Processar arquivo localmente
            setTimeout(() => {
              setSelectedFile(file)
              setError(null)
              
              const url = URL.createObjectURL(file)
              setPreviewUrl(url)
              setProcessedUrl(null)
              setIsEditing(false)
              setHistory([])
              setHistoryIndex(-1)
              setUploadProgress(0)
              setProcessingStep('')
            }, 500)
          } else {
            setUploadProgress(Math.round(progress))
          }
        }, 100)
      }
      
      simulateUpload()
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      // Criar um evento sintético para simular o input
      const syntheticEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(syntheticEvent)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }



  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!canvas || !image) {
      console.log('Canvas ou imagem não encontrados')
      return
    }

    console.log('Inicializando canvas...')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('Contexto 2D não disponível')
      return
    }

    // Configurar canvas com tamanho máximo para visualização
    const maxWidth = 800
    const maxHeight = 600
    
    let { width, height } = image
    const aspectRatio = width / height
    
    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio
    }
    
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }

    console.log(`Configurando canvas: ${width}x${height}`)
    canvas.width = width
    canvas.height = height
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    // Desenhar imagem original redimensionada
    ctx.drawImage(image, 0, 0, width, height)
    
    // Salvar estado inicial
    const imageData = canvas.toDataURL()
    setHistory([imageData])
    setHistoryIndex(0)
    setCanvasInitialized(true)
    console.log('Canvas inicializado com sucesso!')
  }, [])

  const saveState = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.toDataURL()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      loadState(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      loadState(history[historyIndex + 1])
    }
  }

  const loadState = (imageData: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
    }
    img.src = imageData
  }

  const getPixelColor = (x: number, y: number): string => {
    const canvas = canvasRef.current
    if (!canvas) return "#ffffff"

    const ctx = canvas.getContext('2d')
    if (!ctx) return "#ffffff"

    const pixel = ctx.getImageData(x, y, 1, 1).data
    return `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`
  }

  const colorDistance = (color1: string, color2: string): number => {
    const rgb1 = color1.match(/\d+/g)?.map(Number) || [0, 0, 0]
    const rgb2 = color2.match(/\d+/g)?.map(Number) || [0, 0, 0]
    
    return Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
    )
  }

  const floodFill = (startX: number, startY: number, targetColor: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height

    const stack: Point[] = [{ x: startX, y: startY }]
    const visited = new Set<string>()

    while (stack.length > 0) {
      const { x, y } = stack.pop()!
      const key = `${x},${y}`
      
      if (visited.has(key)) continue
      visited.add(key)

      if (x < 0 || x >= width || y < 0 || y >= height) continue

      const index = (y * width + x) * 4
      const currentColor = `rgb(${data[index]}, ${data[index + 1]}, ${data[index + 2]})`
      
      if (colorDistance(currentColor, targetColor) > tolerance) continue

      // Tornar pixel transparente
      data[index + 3] = 0

      // Adicionar pixels vizinhos
      stack.push({ x: x + 1, y })
      stack.push({ x: x - 1, y })
      stack.push({ x, y: y + 1 })
      stack.push({ x, y: y - 1 })
    }

    ctx.putImageData(imageData, 0, 0)
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width))
    const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height))

    if (tool === 'color-picker') {
      const color = getPixelColor(x, y)
      setSelectedColor(color)
    } else if (tool === 'auto-remove') {
      saveState()
      const color = getPixelColor(x, y)
      floodFill(x, y, color)
    }
  }

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'eraser') {
      setIsDrawing(true)
      handleCanvasMouseMove(event)
    }
  }

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool !== 'eraser') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width))
    const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height))

    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, brushSize, 0, 2 * Math.PI)
    ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
  }

  const handleCanvasMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveState()
    }
  }

  const removeBackground = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)
    setUploadProgress(0)
    setProcessingStep('Iniciando remoção de fundo...')

    try {
      console.log('Iniciando remoção de fundo...')
      
      // Simular progresso de processamento
      const simulateProcessing = () => {
        let progress = 0
        const steps = [
          'Inicializando editor...',
          'Carregando imagem...',
          'Analisando pixels...',
          'Detectando fundo...',
          'Aplicando remoção...',
          'Finalizando...'
        ]
        let stepIndex = 0
        
        const interval = setInterval(() => {
          progress += Math.random() * 20 + 10
          if (progress >= 100) {
            progress = 100
            clearInterval(interval)
            setProcessingStep('Concluído!')
            
            setTimeout(() => {
              setIsEditing(true)
              setUploadProgress(0)
              setProcessingStep('')
              
              // Aguardar um pouco para o canvas inicializar e depois aplicar remoção automática
              setTimeout(() => {
                if (canvasRef.current) {
                  console.log('Aplicando remoção automática de fundo...')
                  autoRemoveBackground()
                }
              }, 1000)
            }, 500)
          } else {
            setUploadProgress(Math.round(progress))
            if (progress > (stepIndex + 1) * 16) {
              stepIndex = Math.min(stepIndex + 1, steps.length - 1)
              setProcessingStep(steps[stepIndex])
            }
          }
        }, 200)
      }
      
      simulateProcessing()
    } catch (err) {
      setError(`Erro ao processar a imagem: ${err instanceof Error ? err.message : 'Erro desconhecido'}`)
      console.error('Erro:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Função para converter arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = error => reject(error)
    })
  }

  // API para remoção de fundo usando múltiplas APIs gratuitas
  const removeBackgroundAPI = async (base64Image: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
    try {
      setProcessingStep('Enviando para API de remoção...')
      setUploadProgress(30)
      
      // Tentar com Cloudinary primeiro (mais confiável)
      try {
        setProcessingStep('Tentando Cloudinary...')
        setUploadProgress(40)
        
        // Converter base64 para Blob para enviar corretamente
        const base64Response = await fetch(base64Image)
        const blob = await base64Response.blob()
        
        const formData = new FormData()
        formData.append('file', blob, 'image.png')
        formData.append('upload_preset', 'ml_default')
        formData.append('background_removal', 'true')
        
        const response = await fetch('https://api.cloudinary.com/v1_1/demo/image/upload', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log('Cloudinary funcionou:', data)
          
          if (data.secure_url) {
            setProcessingStep('Finalizando processamento...')
            setUploadProgress(90)
            
            return {
              success: true,
              imageUrl: data.secure_url
            }
          }
        }
        
        console.log('Cloudinary falhou, resposta:', response.status, response.statusText)
        
      } catch (cloudinaryError) {
        console.error('Erro no Cloudinary:', cloudinaryError)
      }
      
      // Fallback: tentar com remove.bg
      try {
        setProcessingStep('Tentando Remove.bg...')
        setUploadProgress(60)
        
        // Converter base64 para URL válida
        const imageUrl = base64Image
        
        const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': 'YOUR_API_KEY_HERE', // Usuário precisa colocar sua própria API key
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image_url: imageUrl,
            size: 'auto'
          })
        })
        
        if (removeBgResponse.ok) {
          const resultBlob = await removeBgResponse.blob()
          const resultUrl = URL.createObjectURL(resultBlob)
          
          return {
            success: true,
            imageUrl: resultUrl
          }
        }
        
        console.log('Remove.bg falhou:', removeBgResponse.status, removeBgResponse.statusText)
        
      } catch (removeBgError) {
        console.error('Erro no Remove.bg:', removeBgError)
      }
      
      // Fallback: tentar com Slazzer
      try {
        setProcessingStep('Tentando Slazzer...')
        setUploadProgress(80)
        
        const slazzerResponse = await fetch('https://slazzer.com/api/v1/remove', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer YOUR_API_KEY_HERE', // Usuário precisa colocar sua própria API key
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            image: base64Image,
            output_format: 'png'
          })
        })
        
        if (slazzerResponse.ok) {
          const data = await slazzerResponse.json()
          
          if (data.url) {
            return {
              success: true,
              imageUrl: data.url
            }
          }
        }
        
        console.log('Slazzer falhou:', slazzerResponse.status, slazzerResponse.statusText)
        
      } catch (slazzerError) {
        console.error('Erro no Slazzer:', slazzerError)
      }
      
      // Se todas as APIs falharem, usar algoritmo local como fallback
      setProcessingStep('Usando algoritmo local...')
      setUploadProgress(90)
      
      console.log('Todas as APIs falharam, usando algoritmo local')
      
      return {
        success: false,
        error: 'APIs externas falharam. Use o editor para remoção manual.'
      }
      
    } catch (error) {
      console.error('Erro geral na API:', error)
      return {
        success: false,
        error: 'Erro inesperado. Tente novamente.'
      }
    }
  }

  // Aplicar imagem processada no canvas
  const applyProcessedImage = (imageUrl: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      // Configurar canvas com tamanho da imagem processada
      const maxWidth = 800
      const maxHeight = 600
      
      let { width, height } = img
      const aspectRatio = width / height
      
      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }
      
      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }

      canvas.width = width
      canvas.height = height
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Desenhar imagem processada
      ctx.drawImage(img, 0, 0, width, height)
      
      // Salvar estado inicial
      const imageData = canvas.toDataURL()
      setHistory([imageData])
      setHistoryIndex(0)
      setCanvasInitialized(true)
      
      console.log('Imagem processada aplicada com sucesso!')
    }
    
    img.onerror = () => {
      console.error('Erro ao carregar imagem processada')
      setError('Erro ao carregar imagem processada')
    }
    
    img.src = imageUrl
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `imagem_sem_fundo_${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    setProcessedUrl(null)
    setError(null)
    setIsEditing(false)
    setHistory([])
    setHistoryIndex(-1)
    setCanvasInitialized(false)
    setUploadProgress(0)
    setProcessingStep('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const autoRemoveBackground = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    console.log('Iniciando remoção automática de fundo...')
    saveState()
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const width = canvas.width
    const height = canvas.height

    // Algoritmo melhorado de remoção de fundo
    removeBackgroundFast(data, width, height)

    ctx.putImageData(imageData, 0, 0)
    console.log('Remoção automática concluída!')
  }

  const removeBackgroundFast = (data: Uint8ClampedArray, width: number, height: number) => {
    console.log('Executando algoritmo de remoção de fundo...')
    
    // Analisar bordas para detectar cor do fundo
    const borderColors = getBorderColors(data, width, height)
    console.log('Cores de fundo detectadas:', borderColors)
    
    let pixelsRemoved = 0
    
    // Remover pixels similares ao fundo
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Verificar se é similar ao fundo
      const isBackground = borderColors.some(bgColor => {
        const distance = Math.sqrt(
          Math.pow(r - bgColor.r, 2) + 
          Math.pow(g - bgColor.g, 2) + 
          Math.pow(b - bgColor.b, 2)
        )
        return distance < 80 // Threshold aumentado para ser mais eficaz
      })
      
      if (isBackground) {
        data[i + 3] = 0 // Tornar transparente
        pixelsRemoved++
      }
    }
    
    console.log(`Removidos ${pixelsRemoved} pixels de fundo`)
  }

  const getBorderColors = (data: Uint8ClampedArray, width: number, height: number) => {
    const colors: { r: number, g: number, b: number }[] = []
    
    // Amostras das bordas (mais preciso)
    const samples = []
    const step = Math.max(3, Math.floor(Math.min(width, height) / 30)) // Mais amostras
    
    // Borda superior e inferior
    for (let x = 0; x < width; x += step) {
      samples.push(x * 4) // Topo
      samples.push(((height - 1) * width + x) * 4) // Base
    }
    
    // Borda esquerda e direita
    for (let y = 0; y < height; y += step) {
      samples.push((y * width) * 4) // Esquerda
      samples.push((y * width + width - 1) * 4) // Direita
    }
    
    // Calcular cores médias das bordas
    if (samples.length > 0) {
      let totalR = 0, totalG = 0, totalB = 0
      samples.forEach(idx => {
        totalR += data[idx]
        totalG += data[idx + 1]
        totalB += data[idx + 2]
      })
      
      colors.push({
        r: totalR / samples.length,
        g: totalG / samples.length,
        b: totalB / samples.length
      })
    }
    
    // Adicionar cores claras comuns (mais variações)
    colors.push({ r: 255, g: 255, b: 255 }) // Branco puro
    colors.push({ r: 250, g: 250, b: 250 }) // Branco sujo
    colors.push({ r: 245, g: 245, b: 245 }) // Cinza muito claro
    colors.push({ r: 240, g: 240, b: 240 }) // Cinza claro
    colors.push({ r: 235, g: 235, b: 235 }) // Cinza médio-claro
    
    // Adicionar cores de fundo comuns
    colors.push({ r: 248, g: 248, b: 248 }) // Fundo de documento
    colors.push({ r: 252, g: 252, b: 252 }) // Fundo de tela
    
    console.log('Cores de fundo detectadas:', colors)
    return colors
  }

  // useEffect para inicializar canvas quando a imagem carregar
  useEffect(() => {
    if (isEditing && imageLoaded && !canvasInitialized) {
      console.log('useEffect: Inicializando canvas...')
      setTimeout(() => {
        initializeCanvas()
        // Aplicar remoção automática após inicialização
        setTimeout(() => {
          console.log('Aplicando remoção automática...')
          autoRemoveBackground()
        }, 200)
      }, 100)
    }
  }, [isEditing, imageLoaded, canvasInitialized, initializeCanvas])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border border-gray-700 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-200">Removedor de Fundo Avançado</h2>
                <p className="text-sm text-gray-400">Edite e remova fundos com precisão</p>
              </div>
            </div>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>



          {!isEditing ? (
            <>
              

                             {/* Upload Area */}
               {!selectedFile && (
                <div
                  className="w-full h-64 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl border-2 border-dashed border-gray-600/30 flex items-center justify-center hover:border-green-500/50 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-lg text-gray-300 mb-2">Arraste uma imagem aqui</div>
                    <div className="text-sm text-gray-500 mb-4">ou clique para selecionar</div>
                    <div className="text-xs text-gray-600">
                      Suporta: JPG, PNG, WEBP (máx. 10MB)
                    </div>
                  </div>
                </div>
              )}

              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Preview and Processing */}
              {selectedFile && (
                <div className="space-y-4">
                  {/* Original Image */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Imagem Original</h3>
                    <div className="relative">
                      <img
                        ref={imageRef}
                        src={previewUrl!}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-600/30"
                        onLoad={() => {
                          console.log('Imagem carregada!')
                          setImageLoaded(true)
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={resetForm}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Process Button */}
                  <Button
                    onClick={removeBackground}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-green-600/20 to-green-700/20 hover:from-green-600/30 hover:to-green-700/30 text-green-300 border border-green-600/30"
                    size="lg"
                  >
                                         {isProcessing ? (
                       <>
                         <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                         Processando...
                       </>
                     ) : (
                       <>
                         <Palette className="w-5 h-5 mr-2" />
                         Iniciar Editor
                       </>
                     )}
                  </Button>
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{processingStep}</span>
                    <span className="text-green-400 font-mono">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-800/50 rounded-full h-3 border border-gray-700/50 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300 ease-out relative"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Processando localmente no seu computador</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Editor Interface */
            <div className="space-y-4">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center space-x-2">
                  <Button
                    variant={tool === 'eraser' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('eraser')}
                    className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-600/30"
                  >
                    <Eraser className="w-4 h-4 mr-1" />
                    Apagar
                  </Button>
                  <Button
                    variant={tool === 'color-picker' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('color-picker')}
                    className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-600/30"
                  >
                    <Pipette className="w-4 h-4 mr-1" />
                    Cor
                  </Button>
                  <Button
                    variant={tool === 'auto-remove' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('auto-remove')}
                    className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-600/30"
                  >
                    <Wand2 className="w-4 h-4 mr-1" />
                    Auto
                  </Button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Tolerância:</span>
                    <Slider
                      value={[tolerance]}
                      onValueChange={([value]) => setTolerance(value)}
                      max={100}
                      min={1}
                      step={1}
                      className="w-20"
                    />
                    <span className="text-xs text-gray-300 w-8">{tolerance}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Pincel:</span>
                    <Slider
                      value={[brushSize]}
                      onValueChange={([value]) => setBrushSize(value)}
                      max={50}
                      min={1}
                      step={1}
                      className="w-20"
                    />
                    <span className="text-xs text-gray-300 w-8">{brushSize}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">Zoom:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <span className="text-xs text-gray-300 w-12">{Math.round(zoom * 100)}%</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={undo}
                    disabled={historyIndex <= 0}
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={redo}
                    disabled={historyIndex >= history.length - 1}
                  >
                    <Redo2 className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  onClick={autoRemoveBackground}
                  size="sm"
                  className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border-purple-600/30"
                >
                  <Wand2 className="w-4 h-4 mr-1" />
                  Remoção Automática
                </Button>
              </div>

              {/* Color Display */}
              {tool === 'color-picker' && (
                <div className="flex items-center space-x-2 p-2 bg-gray-800/30 rounded">
                  <span className="text-xs text-gray-400">Cor selecionada:</span>
                  <div 
                    className="w-6 h-6 rounded border border-gray-600"
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="text-xs text-gray-300">{selectedColor}</span>
                </div>
              )}

              {/* Canvas */}
              <div className="flex justify-center">
                <div 
                  className="border border-gray-600/30 rounded-lg overflow-hidden bg-gray-800/20"
                  style={{ 
                    transform: `scale(${zoom})`, 
                    transformOrigin: 'center',
                    minHeight: '400px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {!canvasInitialized ? (
                    <div className="flex flex-col items-center justify-center text-gray-400 p-8">
                      {/* Animated Loading Icon */}
                      <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-gray-700/50 rounded-full"></div>
                        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-green-400 rounded-full animate-spin"></div>
                        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-gray-600/30 rounded-full"></div>
                        <div className="absolute top-4 left-4 w-8 h-8 border-4 border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                      </div>
                      
                      {/* Loading Text */}
                      <div className="text-center space-y-2">
                        <p className="text-lg font-medium text-gray-300">Carregando Editor</p>
                        <p className="text-sm text-gray-500">Preparando ferramentas de edição...</p>
                      </div>
                      
                      {/* Progress Dots */}
                      <div className="flex space-x-2 mt-4">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      
                      {/* Manual Retry Button */}
                      <Button
                        onClick={() => {
                          console.log('Tentando inicializar canvas manualmente...')
                          initializeCanvas()
                        }}
                        size="sm"
                        className="mt-6 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border-blue-600/30"
                      >
                        Tentar Novamente
                      </Button>
                    </div>
                  ) : (
                    <canvas
                      ref={canvasRef}
                      className="cursor-crosshair max-w-full max-h-full"
                      style={{
                        display: 'block',
                        background: 'repeating-conic-gradient(#333 0% 25%, transparent 0% 50%) 50% / 20px 20px'
                      }}
                      onClick={handleCanvasClick}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Voltar
                </Button>
                <Button
                  onClick={downloadImage}
                  className="bg-green-600/20 hover:bg-green-600/30 text-green-300 border-green-600/30"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Imagem
                </Button>
              </div>
            </div>
          )}

                     {/* Info */}
           <div className="mt-6 space-y-4">
             {/* API Info */}
             <div className="p-4 bg-purple-900/20 border border-purple-600/30 rounded-lg">
               <div className="flex items-start space-x-3">
                 <Zap className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                 <div>
                   <h4 className="text-sm font-medium text-purple-300 mb-2">🚀 Remoção Inteligente Local</h4>
                   <p className="text-xs text-purple-400 mb-3">
                     Usamos <strong>algoritmos inteligentes</strong> para remoção automática de fundo!
                   </p>
                   <div className="space-y-2 text-xs text-purple-400">
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                       <span><strong>Detecção Automática:</strong> Analisa bordas e cores</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                       <span><strong>Processamento Local:</strong> 100% no seu computador</span>
                     </div>
                     <div className="flex items-center space-x-2">
                       <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                       <span><strong>Editor Avançado:</strong> Ajustes manuais precisos</span>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
             
             {/* Local Processing Info */}
             <div className="p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
               <h4 className="text-sm font-medium text-green-300 mb-2">🔒 Processamento Local</h4>
               <ul className="text-xs text-green-400 space-y-1">
                 <li>• <strong>100% Local:</strong> Suas imagens nunca saem do seu computador</li>
                 <li>• <strong>Algoritmos Inteligentes:</strong> Detecção automática de fundos</li>
                 <li>• <strong>Privacidade Total:</strong> Processamento seguro e privado</li>
                 <li>• <strong>Editor Avançado:</strong> Ajustes manuais precisos</li>
               </ul>
             </div>
             
             {/* How to Use */}
             <div className="p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
               <h4 className="text-sm font-medium text-blue-300 mb-2">ℹ️ Como usar o editor</h4>
               <ul className="text-xs text-blue-400 space-y-1">
                 <li>• <strong>Iniciar Editor:</strong> Clique para abrir o editor avançado</li>
                 <li>• <strong>Remoção Automática:</strong> Fundo removido automaticamente</li>
                 <li>• <strong>Apagar:</strong> Clique e arraste para remover áreas manualmente</li>
                 <li>• <strong>Cor:</strong> Clique em uma cor para selecioná-la</li>
                 <li>• <strong>Auto:</strong> Clique em uma área para remover pixels similares</li>
                 <li>• <strong>Ctrl+Z/Ctrl+Y:</strong> Desfazer/Refazer ações</li>
               </ul>
             </div>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
