import { useState, useEffect, useCallback } from 'react'
import { 
  TeamData, 
  TeamMember,
  fullSyncTeam,
  getTeamData,
  subscribeToTeamData,
  updateTeamMember,
  addTeamMember,
  needsSync
} from '@/lib/funcionario-sync'

export function useTeamSync() {
  const [teamData, setTeamData] = useState<TeamData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Buscar dados iniciais
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getTeamData()
      setTeamData(data)

      // Se não há dados ou precisa sincronizar, fazer sync
      if (!data || needsSync(data.lastSync)) {
        await syncData()
      }
    } catch (err) {
      console.error('Erro ao buscar dados da equipe:', err)
      setError('Erro ao carregar dados da equipe')
    } finally {
      setLoading(false)
    }
  }, [])

  // Sincronizar dados
  const syncData = useCallback(async () => {
    try {
      setSyncing(true)
      setError(null)
      
      const data = await fullSyncTeam()
      setTeamData(data)
      
      console.log('✅ Sincronização da equipe concluída com sucesso')
    } catch (err) {
      console.error('Erro na sincronização da equipe:', err)
      setError('Erro ao sincronizar dados da equipe')
    } finally {
      setSyncing(false)
    }
  }, [])

  // Atualizar membro da equipe
  const updateMember = useCallback(async (memberId: string, updates: Partial<TeamMember>) => {
    try {
      await updateTeamMember(memberId, updates)
      
      // Atualizar dados locais
      if (teamData) {
        setTeamData({
          ...teamData,
          members: teamData.members.map(member => 
            member.id === memberId ? { ...member, ...updates } : member
          )
        })
      }
    } catch (err) {
      console.error('Erro ao atualizar membro da equipe:', err)
      setError('Erro ao atualizar membro da equipe')
    }
  }, [teamData])

  // Adicionar novo membro
  const addMember = useCallback(async (member: Omit<TeamMember, 'id' | 'joinedAt' | 'updatedAt'>) => {
    try {
      const memberId = await addTeamMember(member)
      
      // Atualizar dados locais
      if (teamData) {
        const newMember: TeamMember = {
          ...member,
          id: memberId,
          joinedAt: new Date(),
          updatedAt: new Date()
        }
        
        setTeamData({
          ...teamData,
          members: [...teamData.members, newMember],
          totalMembers: teamData.totalMembers + 1,
          activeMembers: teamData.activeMembers + (member.isActive ? 1 : 0)
        })
      }
      
      return memberId
    } catch (err) {
      console.error('Erro ao adicionar membro da equipe:', err)
      setError('Erro ao adicionar membro da equipe')
      throw err
    }
  }, [teamData])

  // Listener em tempo real
  useEffect(() => {
    const unsubscribe = subscribeToTeamData((data) => {
      if (data) {
        setTeamData(data)
        setError(null)
      }
    })

    return unsubscribe
  }, [])

  // Buscar dados na montagem do componente
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-sync a cada 10 minutos (menos frequente que funcionários)
  useEffect(() => {
    const interval = setInterval(() => {
      if (teamData && needsSync(teamData.lastSync)) {
        console.log('🔄 Auto-sync da equipe iniciado...')
        syncData()
      }
    }, 10 * 60 * 1000) // 10 minutos

    return () => clearInterval(interval)
  }, [teamData, syncData])

  return {
    // Dados
    teamData,
    members: teamData?.members || [],
    
    // Estados
    loading,
    syncing,
    error,
    
    // Ações
    syncData,
    updateMember,
    addMember,
    refetch: fetchData,
    
    // Utilitários
    totalMembers: teamData?.totalMembers || 0,
    activeMembers: teamData?.activeMembers || 0,
    needsSync: teamData ? needsSync(teamData.lastSync) : false
  }
}
