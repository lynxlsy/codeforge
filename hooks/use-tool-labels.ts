import { useState, useEffect } from 'react'
import { collection, doc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface ToolLabel {
  id: string
  name: string
  status: 'development' | 'available' | 'premium' | 'beta'
  color: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export interface ToolWithLabel {
  id: string
  name: string
  label?: ToolLabel
}

export function useToolLabels() {
  const [labels, setLabels] = useState<ToolLabel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar etiquetas do Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'toolLabels'),
      (snapshot) => {
        const labelsData: ToolLabel[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()
          labelsData.push({
            id: doc.id,
            name: data.name,
            status: data.status,
            color: data.color,
            description: data.description,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          })
        })
        setLabels(labelsData)
        setLoading(false)
      },
      (err) => {
        console.error('Erro ao carregar etiquetas:', err)
        setError('Erro ao carregar etiquetas')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // Criar nova etiqueta
  const createLabel = async (label: Omit<ToolLabel, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newLabel = {
        ...label,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const docRef = doc(collection(db, 'toolLabels'))
      await setDoc(docRef, newLabel)
      
      return docRef.id
    } catch (err) {
      console.error('Erro ao criar etiqueta:', err)
      throw err
    }
  }

  // Atualizar etiqueta
  const updateLabel = async (id: string, updates: Partial<ToolLabel>) => {
    try {
      const docRef = doc(db, 'toolLabels', id)
      await setDoc(docRef, {
        ...updates,
        updatedAt: new Date(),
      }, { merge: true })
    } catch (err) {
      console.error('Erro ao atualizar etiqueta:', err)
      throw err
    }
  }

  // Excluir etiqueta
  const deleteLabel = async (id: string) => {
    try {
      const docRef = doc(db, 'toolLabels', id)
      await deleteDoc(docRef)
    } catch (err) {
      console.error('Erro ao excluir etiqueta:', err)
      throw err
    }
  }

  // Obter etiqueta por nome da ferramenta
  const getLabelForTool = (toolName: string): ToolLabel | undefined => {
    return labels.find(label => label.name === toolName)
  }

  return {
    labels,
    loading,
    error,
    createLabel,
    updateLabel,
    deleteLabel,
    getLabelForTool,
  }
}
