import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export interface Order {
  id: string
  client: string
  project: string
  value: string
  status: 'Aprovado' | 'Pendente' | 'Cancelado'
  date: string
  priority: 'Alta' | 'Média' | 'Baixa'
  description?: string
  createdAt: Date
  updatedAt: Date
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar se estamos no cliente
  const isClient = typeof window !== 'undefined'

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Verificar se o Firebase está disponível
      if (!db) {
        throw new Error('Firebase não está disponível')
      }
      
      const ordersRef = collection(db, 'orders')
      const q = query(ordersRef, orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const ordersData: Order[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        ordersData.push({
          id: doc.id,
          client: data.client,
          project: data.project,
          value: data.value,
          status: data.status,
          date: data.date,
          priority: data.priority,
          description: data.description,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        })
      })
      
      setOrders(ordersData)
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
      setError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const ordersRef = collection(db, 'orders')
      const newOrder = {
        ...orderData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      const docRef = await addDoc(ordersRef, newOrder)
      await fetchOrders() // Recarregar lista
      return docRef.id
    } catch (err) {
      console.error('Erro ao adicionar pedido:', err)
      throw new Error('Erro ao adicionar pedido')
    }
  }

  const updateOrder = async (id: string, updates: Partial<Order>) => {
    try {
      const orderRef = doc(db, 'orders', id)
      await updateDoc(orderRef, {
        ...updates,
        updatedAt: new Date(),
      })
      await fetchOrders() // Recarregar lista
    } catch (err) {
      console.error('Erro ao atualizar pedido:', err)
      throw new Error('Erro ao atualizar pedido')
    }
  }

  const deleteOrder = async (id: string) => {
    try {
      const orderRef = doc(db, 'orders', id)
      await deleteDoc(orderRef)
      await fetchOrders() // Recarregar lista
    } catch (err) {
      console.error('Erro ao deletar pedido:', err)
      throw new Error('Erro ao deletar pedido')
    }
  }

  const getApprovedOrders = () => {
    return orders.filter(order => order.status === 'Aprovado')
  }

  const getPendingOrders = () => {
    return orders.filter(order => order.status === 'Pendente')
  }

  useEffect(() => {
    if (isClient) {
      fetchOrders()
    }
  }, [isClient])

  return {
    orders,
    loading,
    error,
    fetchOrders,
    addOrder,
    updateOrder,
    deleteOrder,
    getApprovedOrders,
    getPendingOrders,
  }
}

