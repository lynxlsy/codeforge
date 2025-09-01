import { useState, useEffect, useCallback } from 'react'
import { 
  Employee,
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  subscribeToEmployees,
  syncInitialEmployees
} from '@/lib/funcionario-sync'

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Buscar dados iniciais
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Buscando funcionários...')
      
      // Sincronizar funcionários iniciais se necessário
      await syncInitialEmployees()
      
      // Buscar funcionários
      const data = await getEmployees()
      console.log('✅ Funcionários carregados:', data.length)
      setEmployees(data)
    } catch (err) {
      console.error('❌ Erro ao buscar funcionários:', err)
      setError('Erro ao carregar funcionários')
    } finally {
      setLoading(false)
    }
  }, [])

  // Adicionar funcionário
  const addNewEmployee = useCallback(async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null)
      console.log('🔄 Adicionando funcionário via hook:', employee)
      
      const employeeId = await addEmployee(employee)
      console.log('✅ Funcionário adicionado com ID:', employeeId)
      
      // Atualizar lista local
      const newEmployee: Employee = {
        ...employee,
        id: employeeId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setEmployees(prev => [...prev, newEmployee])
      console.log('✅ Lista local atualizada')
      
      return employeeId
    } catch (err) {
      console.error('❌ Erro ao adicionar funcionário:', err)
      setError('Erro ao adicionar funcionário')
      throw err
    }
  }, [])

  // Atualizar funcionário
  const updateExistingEmployee = useCallback(async (
    employeeId: string, 
    updates: Partial<Omit<Employee, 'id' | 'createdAt'>>
  ) => {
    try {
      setError(null)
      await updateEmployee(employeeId, updates)
      
      // Atualizar lista local
      setEmployees(prev => prev.map(emp => 
        emp.id === employeeId 
          ? { ...emp, ...updates, updatedAt: new Date() }
          : emp
      ))
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err)
      setError('Erro ao atualizar funcionário')
      throw err
    }
  }, [])

  // Excluir funcionário
  const deleteExistingEmployee = useCallback(async (employeeId: string) => {
    try {
      setError(null)
      await deleteEmployee(employeeId)
      
      // Atualizar lista local
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId))
    } catch (err) {
      console.error('Erro ao excluir funcionário:', err)
      setError('Erro ao excluir funcionário')
      throw err
    }
  }, [])

  // Listener em tempo real
  useEffect(() => {
    console.log('🔄 Configurando listener em tempo real...')
    
    const unsubscribe = subscribeToEmployees((data) => {
      console.log('🔄 Dados atualizados em tempo real:', data.length, 'funcionários')
      console.log('📊 Funcionários recebidos:', data.map(e => `${e.username} (${e.id})`))
      setEmployees(data)
      setError(null)
    })

    return () => {
      console.log('🔄 Removendo listener em tempo real')
      unsubscribe()
    }
  }, [])

  // Buscar dados na montagem do componente
  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  return {
    // Dados
    employees,
    
    // Estados
    loading,
    error,
    
    // Ações
    addEmployee: addNewEmployee,
    updateEmployee: updateExistingEmployee,
    deleteEmployee: deleteExistingEmployee,
    refetch: fetchEmployees,
    
    // Utilitários
    totalEmployees: employees.length,
    devEmployees: employees.filter(e => e.role === 'dev').length,
    funcionarioEmployees: employees.filter(e => e.role === 'funcionario').length,
    activeEmployees: employees.filter(e => e.isActive).length
  }
}


