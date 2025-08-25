import type { ProjectData } from "@/components/project-flow/project-flow"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"

interface QuoteResult {
  basePrice: number
  complexityMultiplier: number
  timelineMultiplier: number
  featuresPrice: number
  textComplexityMultiplier: number
  finalPrice: number
  estimatedDays: number
}

// Dados de preços dinâmicos (carregados do Firebase)
let dynamicPricingData = {
  bots: {
    discord: { min: 25, max: 70 },
    instagram: { min: 45, max: 70 },
    whatsapp: { min: 35, max: 70 },
    telegram: { min: 20, max: 70 },
    custom: { min: 65, max: 70 }
  },
  sites: {
    landing: { min: 30, max: 70 },
    ecommerce: { min: 70, max: 70 },
    portfolio: { min: 25, max: 70 },
    corporate: { min: 50, max: 70 },
    webapp: { min: 70, max: 70 }
  },
  personalizados: {
    api: { min: 70, max: 70 },
    integration: { min: 40, max: 70 },
    automation: { min: 55, max: 70 },
    consulting: { min: 25, max: 70 },
    maintenance: { min: 30, max: 70 }
  }
}

// Multiplicadores de complexidade
const complexityMultipliers = {
  basic: 0.8,      // 80% do preço base (projetos simples)
  intermediate: 1.0, // 100% do preço base (projetos moderados)
  advanced: 1.5     // 150% do preço base (projetos complexos)
}

// Função para carregar preços do Firebase
export async function loadPricingFromFirebase() {
  try {
    const pricingDoc = await getDoc(doc(db, "config", "pricing"))
    if (pricingDoc.exists()) {
      dynamicPricingData = pricingDoc.data() as typeof dynamicPricingData
      console.log("✅ Preços carregados do Firebase:", dynamicPricingData)
    } else {
      // Se não existir, criar com dados padrão
      await setDoc(doc(db, "config", "pricing"), dynamicPricingData)
      console.log("📝 Dados padrão salvos no Firebase")
    }
  } catch (error) {
    console.error("❌ Erro ao carregar preços do Firebase:", error)
  }
}

// Função para salvar preços no Firebase
export async function savePricingToFirebase(newPricingData: typeof dynamicPricingData) {
  try {
    await setDoc(doc(db, "config", "pricing"), newPricingData)
    dynamicPricingData = newPricingData
    console.log("✅ Preços salvos no Firebase:", newPricingData)
    return true
  } catch (error) {
    console.error("❌ Erro ao salvar preços no Firebase:", error)
    return false
  }
}

// Função para escutar mudanças em tempo real
export function subscribeToPricingChanges(callback: (data: typeof dynamicPricingData) => void) {
  return onSnapshot(doc(db, "config", "pricing"), (doc) => {
    if (doc.exists()) {
      const data = doc.data() as typeof dynamicPricingData
      dynamicPricingData = data
      callback(data)
      console.log("🔄 Preços atualizados em tempo real:", data)
    }
  })
}

function calculateTextComplexity(description: string): number {
  if (!description || description.trim().length === 0) return 1

  const wordCount = description.trim().split(/\s+/).length
  const charCount = description.length

  // Base multiplier starts at 1
  let multiplier = 1

  // Word count impact (more detailed descriptions = higher price)
  if (wordCount > 100)
    multiplier += 0.3 // Very detailed (30% increase) - reduzido de 0.4
  else if (wordCount > 50)
    multiplier += 0.2 // Detailed (20% increase) - reduzido de 0.25
  else if (wordCount > 20)
    multiplier += 0.1 // Moderate (10% increase) - reduzido de 0.15
  else if (wordCount > 10) multiplier += 0.05 // Basic (5% increase)

  // Character count impact (longer descriptions = more complexity)
  if (charCount > 800)
    multiplier += 0.15 // Very long - reduzido de 0.2
  else if (charCount > 400)
    multiplier += 0.08 // Long - reduzido de 0.1
  else if (charCount > 200) multiplier += 0.04 // Medium - reduzido de 0.05

  // Technical keywords that indicate complexity
  const technicalKeywords = [
    "api",
    "integração",
    "banco de dados",
    "dashboard",
    "admin",
    "autenticação",
    "pagamento",
    "webhook",
    "automação",
    "inteligência artificial",
    "machine learning",
    "analytics",
    "relatório",
    "export",
    "import",
    "sincronização",
    "real-time",
    "notificação",
    "email",
    "sms",
    "chat",
    "bot",
    "scraping",
    "crawling",
  ]

  const lowerDescription = description.toLowerCase()
  const keywordCount = technicalKeywords.filter((keyword) => lowerDescription.includes(keyword)).length

  // Each technical keyword adds complexity (reduzido de 0.1 para 0.08)
  multiplier += keywordCount * 0.08

  // Cap the multiplier to prevent excessive pricing (reduzido de 2.5 para 1.8)
  return Math.min(multiplier, 1.8)
}

function getCategoryFromPlatform(platformId: string): string {
  // Mapear plataformas para categorias
  const platformToCategory: Record<string, string> = {
    // Bots
    discord: 'bots',
    instagram: 'bots',
    whatsapp: 'bots',
    telegram: 'bots',
    custom: 'bots',
    // Sites
    landing: 'sites',
    ecommerce: 'sites',
    portfolio: 'sites',
    corporate: 'sites',
    webapp: 'sites',
    // Personalizados
    api: 'personalizados',
    integration: 'personalizados',
    automation: 'personalizados',
    consulting: 'personalizados',
    maintenance: 'personalizados'
  }
  
  return platformToCategory[platformId] || 'bots'
}

function calculateDynamicPrice(platformId: string, complexity: string, description: string, featuresCount: number): number {
  const category = getCategoryFromPlatform(platformId)
  const categoryData = dynamicPricingData[category as keyof typeof dynamicPricingData]
  const pricing = (categoryData as any)[platformId]
  
  if (!pricing) {
    // Fallback para preços antigos se a plataforma não estiver mapeada
    return 50
  }

  // Calcular preço base baseado na complexidade
  const complexityMultiplier = complexityMultipliers[complexity as keyof typeof complexityMultipliers]
  
  // Calcular preço base dentro do range min-max baseado na complexidade
  let basePrice: number
  if (complexityMultiplier <= 1.0) {
    // Para complexidade básica e intermediária, usar proporção do range
    const range = pricing.max - pricing.min
    const proportion = (complexityMultiplier - 0.8) / (1.0 - 0.8) // 0.8 a 1.0
    basePrice = pricing.min + (range * proportion)
  } else {
    // Para complexidade avançada, usar proporção do range superior
    const range = pricing.max - pricing.min
    const proportion = (complexityMultiplier - 1.0) / (1.5 - 1.0) // 1.0 a 1.5
    basePrice = pricing.min + (range * 0.5) + (range * 0.5 * proportion)
  }
  
  // Aplicar multiplicador de complexidade do texto (limitado para não ultrapassar o máximo)
  const textComplexityMultiplier = calculateTextComplexity(description)
  
  // Preço das funcionalidades extras (R$ 5 por funcionalidade)
  const featuresPrice = featuresCount * 5
  
  // Calcular preço final
  let finalPrice = basePrice * textComplexityMultiplier + featuresPrice
  
  // GARANTIR que o preço final esteja dentro do range min-max
  finalPrice = Math.max(finalPrice, pricing.min)
  finalPrice = Math.min(finalPrice, pricing.max)
  
  return Math.round(finalPrice)
}

export function calculateQuote(projectData: ProjectData): QuoteResult {
  if (!projectData.platform) {
    return {
      basePrice: 0,
      complexityMultiplier: 1,
      timelineMultiplier: 1,
      featuresPrice: 0,
      textComplexityMultiplier: 1,
      finalPrice: 0,
      estimatedDays: 1,
    }
  }

  const platformId = projectData.platform.id
  const category = getCategoryFromPlatform(platformId)
  const categoryData = dynamicPricingData[category as keyof typeof dynamicPricingData]
  const pricing = (categoryData as any)[platformId]
  
  // Calcular preço base usando o sistema dinâmico
  const basePrice = pricing ? pricing.min : projectData.platform.basePrice

  // Complexity multipliers (usado para cálculo de dias)
  const complexityMultipliers = {
    basic: 1,
    intermediate: 1.5,
    advanced: 2,
  }
  const complexityMultiplier = complexityMultipliers[projectData.complexity]

  // Timeline multipliers
  const timelineMultipliers = {
    urgent: 1.5,
    normal: 1,
    flexible: 0.9,
  }
  const timelineMultiplier = timelineMultipliers[projectData.timeline]

  const textComplexityMultiplier = calculateTextComplexity(projectData.description || "")

  // Features pricing (R$5 per feature)
  const featuresPrice = projectData.features.length * 5

  // Calcular preço final usando o sistema dinâmico
  let finalPrice = calculateDynamicPrice(
    platformId,
    projectData.complexity,
    projectData.description || "",
    projectData.features.length
  )

  // Verificação final de segurança - garantir que nunca ultrapasse o máximo
  if (pricing && finalPrice > pricing.max) {
    console.warn(`Preço calculado (${finalPrice}) ultrapassou o máximo (${pricing.max}). Ajustando para o máximo.`)
    finalPrice = pricing.max
  }

  // Calculate estimated days
  const baseDays = {
    urgent: 2,
    normal: 7,
    flexible: 14,
  }

  const complexityDaysMultiplier = {
    basic: 1,
    intermediate: 1.5,
    advanced: 2,
  }

  const textComplexityDays = textComplexityMultiplier > 1.5 ? 1.3 : 1
  const estimatedDays = Math.ceil(
    baseDays[projectData.timeline] * complexityDaysMultiplier[projectData.complexity] * textComplexityDays,
  )

  return {
    basePrice,
    complexityMultiplier,
    timelineMultiplier,
    featuresPrice,
    textComplexityMultiplier,
    finalPrice,
    estimatedDays,
  }
}

// Função para atualizar os preços dinâmicos (será chamada pelo DEV dashboard)
export async function updateDynamicPricing(newPricingData: typeof dynamicPricingData) {
  const success = await savePricingToFirebase(newPricingData)
  return success
}

// Função para obter os preços atuais (para o DEV dashboard)
export function getCurrentPricing() {
  return dynamicPricingData
}
