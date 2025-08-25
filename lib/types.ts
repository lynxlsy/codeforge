export interface Project {
  id: string
  client: string
  email: string
  platform: "discord-bot" | "instagram-bot" | "website" | "system"
  description: string
  features: string[]
  complexity: "basic" | "intermediate" | "advanced"
  timeline: "urgent" | "normal" | "flexible"
  status: "pending" | "approved" | "in_progress" | "completed" | "cancelled"
  price: number
  date: string
  contactMethod: "email" | "whatsapp"
  notes?: string
}

export interface ProjectFilter {
  status: string
  platform: string
  complexity: string
  search: string
}

export interface PlatformPricing {
  platform: "discord-bot" | "instagram-bot" | "website" | "system"
  name: string
  basePrice: {
    min: number
    max: number
  }
  description: string
  features: string[]
  active: boolean
}

export interface ComplexityMultiplier {
  complexity: "basic" | "intermediate" | "advanced"
  name: string
  multiplier: number
  description: string
}

export interface PricingConfig {
  platformPricing: PlatformPricing[]
  complexityMultipliers: ComplexityMultiplier[]
  timelineMultipliers: {
    urgent: number
    normal: number
    flexible: number
  }
  updatedAt?: any
}

export interface ServicePlan {
  id: string
  name: string
  platform: "discord-bot" | "instagram-bot" | "website" | "system"
  complexity: "basic" | "intermediate" | "advanced"
  price: number
  features: string[]
  description: string
  active: boolean
  popular?: boolean
}

export interface ContactMethod {
  id: string
  name: string
  type: "email" | "whatsapp" | "discord" | "instagram" | "telegram"
  category: "support" | "commercial" | "technical"
  contact: string
  description: string
  active: boolean
  priority: number
  responseTime: string
  availability: string
  createdAt: string
}

export interface ContactStats {
  totalContacts: number
  activeContacts: number
  contactsByType: Record<string, number>
  contactsByCategory: Record<string, number>
}

