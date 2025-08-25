import { useState } from 'react'
import type { Project } from '@/lib/types'
import { useToast } from '@/hooks/use-toast'

// Verificar se estamos no cliente
const isClient = typeof window !== 'undefined'

export function useOrders() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const submitOrder = async (orderData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!isClient) {
      toast({
        title: "❌ Erro",
        description: "Funcionalidade não disponível no servidor.",
        variant: "destructive",
      })
      return { success: false, error: 'Não disponível no servidor' }
    }

    setLoading(true)
    
    try {
      // Importar serviços dinamicamente
      const { projectsService } = await import('@/lib/firebase-services')
      const { PDFGenerator } = await import('@/lib/pdf-generator')

      // Limpar dados antes de enviar (remover campos undefined)
      const cleanOrderData = Object.fromEntries(
        Object.entries(orderData).filter(([_, value]) => value !== undefined)
      ) as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>

      // Salvar no Firebase
      const projectId = await projectsService.create({
        ...cleanOrderData,
        status: 'pending',
        date: new Date().toISOString()
      })

      // Criar objeto completo do projeto
      const project: Project = {
        id: projectId,
        ...cleanOrderData,
        status: 'pending',
        date: new Date().toISOString()
      }

      // Gerar PDF
      const fileName = await PDFGenerator.generateOrderPDF(project)

      // Mostrar sucesso
      toast({
        title: "✅ Pedido enviado com sucesso!",
        description: `PDF "${fileName}" foi baixado. Envie-o para o WhatsApp da CDforge.`,
        duration: 8000,
      })

      return { success: true, projectId, fileName }
    } catch (error) {
      console.error('Erro ao enviar pedido:', error)
      
      toast({
        title: "❌ Erro ao enviar pedido",
        description: "Tente novamente ou entre em contato conosco.",
        variant: "destructive",
      })

      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  return {
    submitOrder,
    loading
  }
}

