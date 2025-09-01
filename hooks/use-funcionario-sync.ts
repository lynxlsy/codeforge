import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { 
  FuncionarioData, 
  FuncionarioStats,
  fullSyncFuncionario,
  getFuncionarioData,
  subscribeToFuncionarioData,
  updateFuncionarioStatus,
  needsSync
} from '@/lib/funcionario-sync'

export function useFuncionarioSync() {
  const { user } = useAuth()
  const [funcionarioData, setFuncionarioData] = useState<FuncionarioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Buscar dados iniciais
  const fetchData = useCallback(async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      setError(null)
      
      const data = await getFuncionarioData(user.id)
      setFuncionarioData(data)

      // Se não há dados ou precisa sincronizar, fazer sync
      if (!data || needsSync(data.lastSync)) {
        await syncData()
      }
    } catch (err) {
      console.error('Erro ao buscar dados do funcionário:', err)
      setError('Erro ao carregar dados do funcionário')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Sincronizar dados
  const syncData = useCallback(async () => {
    if (!user?.id) return

    try {
      setSyncing(true)
      setError(null)
      
      const data = await fullSyncFuncionario(user.id, user)
      setFuncionarioData(data)
      
      console.log('✅ Sincronização concluída com sucesso')
    } catch (err) {
      console.error('Erro na sincronização:', err)
      setError('Erro ao sincronizar dados')
    } finally {
      setSyncing(false)
    }
  }, [user])

  // Atualizar status
  const updateStatus = useCallback(async (status: 'ativo' | 'inativo' | 'suspenso') => {
    if (!user?.id) return

    try {
      await updateFuncionarioStatus(user.id, status)
      
      // Atualizar dados locais
      if (funcionarioData) {
        setFuncionarioData({
          ...funcionarioData,
          stats: {
            ...funcionarioData.stats,
            status
          }
        })
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      setError('Erro ao atualizar status')
    }
  }, [user?.id, funcionarioData])

  // Listener em tempo real
  useEffect(() => {
    if (!user?.id) return

    const unsubscribe = subscribeToFuncionarioData(user.id, (data) => {
      if (data) {
        setFuncionarioData(data)
        setError(null)
      }
    })

    return unsubscribe
  }, [user?.id])

  // Buscar dados na montagem do componente
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-sync a cada 5 minutos
  useEffect(() => {
    if (!user?.id) return

    const interval = setInterval(() => {
      if (funcionarioData && needsSync(funcionarioData.lastSync)) {
        console.log('🔄 Auto-sync iniciado...')
        syncData()
      }
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [user?.id, funcionarioData, syncData])

  return {
    // Dados
    funcionarioData,
    stats: funcionarioData?.stats || null,
    
    // Estados
    loading,
    syncing,
    error,
    
    // Ações
    syncData,
    updateStatus,
    refetch: fetchData,
    
    // Utilitários
    isOnline: funcionarioData?.stats?.status === 'ativo',
    needsSync: funcionarioData ? needsSync(funcionarioData.lastSync) : false
  }
}
