// Configurações para APIs de remoção de fundo gratuitas

export interface BackgroundRemovalAPI {
  name: string
  url: string
  method: 'POST'
  headers: Record<string, string>
  body: (imageData: string) => any
  responseHandler: (response: Response) => Promise<{ success: boolean; imageUrl?: string; error?: string }>
  isFree: boolean
  monthlyLimit?: number
  description: string
}

// API 1: Cloudinary (Gratuita - 25 créditos/mês)
export const cloudinaryAPI: BackgroundRemovalAPI = {
  name: 'Cloudinary',
  url: 'https://api.cloudinary.com/v1_1/demo/image/upload',
  method: 'POST',
  headers: {},
  body: (imageData: string) => {
    const formData = new FormData()
    formData.append('file', imageData)
    formData.append('upload_preset', 'ml_default')
    formData.append('background_removal', 'true')
    return formData
  },
  responseHandler: async (response: Response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return {
      success: true,
      imageUrl: data.secure_url
    }
  },
  isFree: true,
  monthlyLimit: 25,
  description: 'API gratuita com 25 créditos por mês. Remove fundos automaticamente usando IA.'
}

// API 2: Remove.bg (Gratuita - 50 imagens/mês)
export const removeBgAPI: BackgroundRemovalAPI = {
  name: 'Remove.bg',
  url: 'https://api.remove.bg/v1.0/removebg',
  method: 'POST',
  headers: {
    'X-Api-Key': 'YOUR_API_KEY_HERE', // Usuário precisa colocar sua própria API key
    'Content-Type': 'application/json'
  },
  body: (imageData: string) => ({
    image_url: imageData,
    size: 'auto'
  }),
  responseHandler: async (response: Response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const blob = await response.blob()
    const imageUrl = URL.createObjectURL(blob)
    
    return {
      success: true,
      imageUrl: imageUrl
    }
  },
  isFree: true,
  monthlyLimit: 50,
  description: 'API gratuita com 50 imagens por mês. Qualidade profissional de remoção de fundo.'
}

// API 3: Slazzer (Gratuita - 10 imagens/mês)
export const slazzerAPI: BackgroundRemovalAPI = {
  name: 'Slazzer',
  url: 'https://slazzer.com/api/v1/remove',
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY_HERE', // Usuário precisa colocar sua própria API key
    'Content-Type': 'application/json'
  },
  body: (imageData: string) => ({
    image: imageData,
    output_format: 'png'
  }),
  responseHandler: async (response: Response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return {
      success: true,
      imageUrl: data.url
    }
  },
  isFree: true,
  monthlyLimit: 10,
  description: 'API gratuita com 10 imagens por mês. Interface simples e rápida.'
}

// Lista de todas as APIs disponíveis
export const availableAPIs: BackgroundRemovalAPI[] = [
  cloudinaryAPI,
  removeBgAPI,
  slazzerAPI
]

// Função para obter a melhor API disponível
export const getBestAvailableAPI = (): BackgroundRemovalAPI => {
  // Priorizar Cloudinary por ser mais confiável
  return cloudinaryAPI
}

// Função para tentar múltiplas APIs em caso de falha
export const tryMultipleAPIs = async (imageData: string): Promise<{ success: boolean; imageUrl?: string; error?: string }> => {
  const apis = [cloudinaryAPI, removeBgAPI, slazzerAPI]
  
  for (const api of apis) {
    try {
      console.log(`Tentando API: ${api.name}`)
      
      const response = await fetch(api.url, {
        method: api.method,
        headers: api.headers,
        body: api.body(imageData)
      })
      
      const result = await api.responseHandler(response)
      if (result.success) {
        console.log(`API ${api.name} funcionou!`)
        return result
      }
    } catch (error) {
      console.error(`Erro na API ${api.name}:`, error)
      continue
    }
  }
  
  return {
    success: false,
    error: 'Todas as APIs falharam. Tente novamente mais tarde.'
  }
}
