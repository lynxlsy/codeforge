'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Shield, 
  Users, 
  Circle, 
  Crown,
  Briefcase,
  Zap,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react'

import { 
  PredefinedEmployee, 
  getPredefinedEmployeesFromFirebase, 
  syncPredefinedEmployees,
  clearAndRecreateEmployees,
  getOnlineEmployees
} from '@/lib/predefined-employees'
import { db } from '@/lib/firebase'

export function PredefinedEmployeesManager() {
  const [employees, setEmployees] = useState<PredefinedEmployee[]>([])
  const [onlineEmployees, setOnlineEmployees] = useState<PredefinedEmployee[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [clearing, setClearing] = useState(false)

  // Carregar funcionários
  const loadEmployees = async () => {
    try {
      setLoading(true)
      const firebaseEmployees = await getPredefinedEmployeesFromFirebase()
      setEmployees(firebaseEmployees)
      
      const online = await getOnlineEmployees()
      setOnlineEmployees(online)
    } catch (error) {
      console.error('❌ Erro ao carregar funcionários:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sincronizar funcionários
  const handleSync = async () => {
    try {
      setSyncing(true)
      await syncPredefinedEmployees()
      await loadEmployees()
      alert('✅ Funcionários sincronizados com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro na sincronização:', error)
      alert(`❌ Erro na sincronização: ${error.message}`)
    } finally {
      setSyncing(false)
    }
  }

  // Limpar e recriar funcionários
  const handleClearAndRecreate = async () => {
    try {
      const confirmed = confirm('⚠️ ATENÇÃO: Isso vai REMOVER TODOS os funcionários antigos e criar apenas os novos!\n\nTem certeza?')
      if (!confirmed) return
      
      setClearing(true)
      await clearAndRecreateEmployees()
      await loadEmployees()
      alert('✅ Funcionários limpos e recriados com sucesso!')
    } catch (error: any) {
      console.error('❌ Erro na limpeza:', error)
      alert(`❌ Erro na limpeza: ${error.message}`)
    } finally {
      setClearing(false)
    }
  }

  // Limpeza de emergência
  const handleEmergencyClear = async () => {
    try {
      const confirmed = confirm('🚨 EMERGÊNCIA: Isso vai DESTRUIR TODOS os dados de funcionários e recriar do zero!\n\nTem CERTEZA ABSOLUTA?')
      if (!confirmed) return
      
      const confirmed2 = confirm('🚨 ÚLTIMA CHANCE: Isso vai APAGAR TUDO e criar apenas:\n- dev/D\n- melke/M7\n- ysun/122345\n- pedro/Alice\n- zanesco/HaxSHW02\n\nCONFIRMA?')
      if (!confirmed2) return
      
      setClearing(true)
      
      // Forçar limpeza múltiplas vezes
      for (let i = 0; i < 3; i++) {
        console.log(`🧹 Limpeza forçada ${i + 1}/3`)
        await clearAndRecreateEmployees()
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      await loadEmployees()
      alert('✅ LIMPEZA DE EMERGÊNCIA CONCLUÍDA!')
    } catch (error: any) {
      console.error('❌ Erro na limpeza de emergência:', error)
      alert(`❌ Erro na limpeza de emergência: ${error.message}`)
    } finally {
      setClearing(false)
    }
  }

  // Debug: Verificar funcionários no Firebase
  const handleDebugFirebase = async () => {
    try {
      const { collection, getDocs } = await import('firebase/firestore')
      const employeesSnapshot = await getDocs(collection(db, 'predefined_employees'))
      
      const firebaseEmployees = employeesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      console.log('🔍 Funcionários no Firebase:', firebaseEmployees)
      
      alert(`🔍 Debug Firebase:\n\nTotal no Firebase: ${firebaseEmployees.length}\n\nFuncionários:\n${firebaseEmployees.map(e => `- ${e.username} (${e.name}) - ${e.role}`).join('\n')}\n\n\nTotal na interface: ${employees.length}`)
    } catch (error: any) {
      console.error('❌ Erro no debug:', error)
      alert(`❌ Erro no debug: ${error.message}`)
    }
  }

  // Função removida - cargos agora são definidos no código fonte

  // Carregar dados na montagem
  useEffect(() => {
    loadEmployees()
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-red-500 to-red-600'
      case 'dev': return 'bg-gradient-to-r from-blue-500 to-blue-600'
      case 'funcionario': return 'bg-gradient-to-r from-green-500 to-green-600'
      case 'viewer': return 'bg-gradient-to-r from-gray-500 to-gray-600'
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600'
    }
  }

  const getTypeColor = (type: string) => {
    return type === 'dev' ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'
  }

  const getUserIcon = (username: string) => {
    switch (username) {
      case 'dev': return <Crown className="w-5 h-5" />
      case 'melke': return <Zap className="w-5 h-5" />
      case 'ysun': return <Star className="w-5 h-5" />
      case 'pedro': return <Briefcase className="w-5 h-5" />
      case 'zanesco': return <Shield className="w-5 h-5" />
      default: return <User className="w-5 h-5" />
    }
  }

  const getUserGradient = (username: string) => {
    switch (username) {
      case 'dev': return 'from-red-500 to-red-600'
      case 'melke': return 'from-blue-500 to-blue-600'
      case 'ysun': return 'from-yellow-500 to-yellow-600'
      case 'pedro': return 'from-green-500 to-green-600'
      case 'zanesco': return 'from-purple-500 to-purple-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Gerenciamento de Funcionários
            </h2>
            <p className="text-gray-400">
              Sistema de funcionários predefinidos com status online (cargos fixos no código)
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleEmergencyClear}
            disabled={clearing}
            className="bg-red-800/20 hover:bg-red-800/30 text-red-300 border border-red-600/30 font-medium"
          >
            {clearing ? '🚨 DESTRUINDO...' : '🚨 Limpeza de Emergência'}
          </Button>
          
          <Button 
            onClick={handleClearAndRecreate}
            disabled={clearing}
            className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-600/30"
          >
            {clearing ? '🧹 Limpando...' : '🧹 Limpar e Recriar'}
          </Button>
         
         <Button 
           onClick={handleSync}
           disabled={syncing}
           className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-600/30"
         >
           {syncing ? '🔄 Sincronizando...' : '🔄 Sincronizar'}
         </Button>
         
         <Button 
           onClick={loadEmployees}
           disabled={loading}
           className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 border border-gray-600/30"
         >
           {loading ? '🔄 Carregando...' : '🔄 Recarregar'}
         </Button>
         
         <Button 
           onClick={handleDebugFirebase}
           className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 border border-yellow-600/30"
         >
           🔍 Debug Firebase
         </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-600/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-300" />
              <CardTitle className="text-sm font-medium text-blue-300">Total de Funcionários</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{employees.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-600/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <CardTitle className="text-sm font-medium text-green-300">Online</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{onlineEmployees.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-600/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Crown className="w-4 h-4 text-purple-300" />
              <CardTitle className="text-sm font-medium text-purple-300">Desenvolvedores</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {employees.filter(e => e.type === 'dev').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-600/10 to-orange-800/10 border border-orange-600/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-orange-300" />
              <CardTitle className="text-sm font-medium text-orange-300">Funcionários</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {employees.filter(e => e.type === 'funcionario').length}
            </div>
          </CardContent>
        </Card>
      </div>

            {/* Lista de Funcionários */}
      <Card className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-white">Funcionários ({employees.length})</CardTitle>
              <CardDescription className="text-gray-400">
                Visualize funcionários e status online (cargos definidos no código fonte)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center space-x-2 text-blue-300">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-300"></div>
                <span className="text-lg">Carregando funcionários...</span>
              </div>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-lg text-gray-500">Nenhum funcionário encontrado</div>
              <Button onClick={handleSync} className="mt-4">
                🔄 Sincronizar Funcionários
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employees.map((employee) => {
                const isOnline = onlineEmployees.some(online => online.username === employee.username)
                
                return (
                  <div 
                    key={employee.username}
                    className="relative group bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-xl p-4 hover:border-gray-500/50 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Status Online Indicator */}
                    {isOnline && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                    )}
                    
                    <div className="flex items-start space-x-4">
                      {/* Avatar com ícone */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${getUserGradient(employee.username)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                        <div className="text-white">
                          {getUserIcon(employee.username)}
                        </div>
                      </div>
                      
                      {/* Informações */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-white truncate">{employee.name}</h3>
                          {employee.username === 'dev' && (
                            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1">
                              🔒 DEV
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge className={`${getRoleColor(employee.role)} text-white text-xs px-2 py-1`}>
                            {employee.role}
                          </Badge>
                          <Badge className={`${getTypeColor(employee.type)} text-white text-xs px-2 py-1`}>
                            {employee.type}
                          </Badge>
                          {isOnline && (
                            <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2 py-1">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Online
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-1">
                          {employee.username} • {employee.email}
                        </p>
                        
                        {employee.lastLogin && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>Último login: {employee.lastLogin.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Funcionários Online */}
      {onlineEmployees.length > 0 && (
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border border-green-600/30 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-white">Funcionários Online ({onlineEmployees.length})</CardTitle>
                <CardDescription className="text-green-300">
                  Funcionários atualmente conectados ao sistema
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {onlineEmployees.map((employee) => (
                <div 
                  key={employee.username}
                  className="flex items-center space-x-3 p-4 bg-gradient-to-br from-green-800/30 to-green-700/30 border border-green-600/30 rounded-xl hover:border-green-500/50 transition-all duration-300"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${getUserGradient(employee.username)} rounded-lg flex items-center justify-center shadow-lg`}>
                    <div className="text-white">
                      {getUserIcon(employee.username)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{employee.name}</div>
                    <div className="text-xs text-green-300">{employee.username}</div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
