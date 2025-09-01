"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  UserPlus,
  Shield,
  User,
  Mail,
  Lock,
  Crown,
  UserCheck
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEmployees } from "@/hooks/use-employees"
import { Employee, forceCreateDevUser, cleanupInactiveOnlineUsers, testEmployeeLogin, syncEmployeesToFirebase } from "@/lib/funcionario-sync"

export function EmployeesManager() {
  const { user } = useAuth()
  const { 
    employees, 
    loading, 
    error, 
    addEmployee, 
    updateEmployee, 
    deleteEmployee,
    totalEmployees,
    devEmployees,
    funcionarioEmployees
  } = useEmployees()
  
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)

  // Form states for adding new employee
  const [newEmployee, setNewEmployee] = useState({
    username: "",
    email: "",
    password: "",
    role: "funcionario" as 'dev' | 'funcionario'
  })

  // Form states for editing employee
  const [editEmployee, setEditEmployee] = useState({
    username: "",
    email: "",
    password: "",
    role: "funcionario" as 'dev' | 'funcionario'
  })

  const handleAddEmployee = async () => {
    if (!newEmployee.username || !newEmployee.email || !newEmployee.password) {
      alert("Por favor, preencha todos os campos")
      return
    }

    try {
      console.log('🔄 Tentando adicionar funcionário:', newEmployee)
      
      // Mostrar loading
      const loadingButton = document.querySelector('[data-loading="true"]')
      if (loadingButton) {
        loadingButton.textContent = '🔄 Criando...'
        loadingButton.setAttribute('disabled', 'true')
      }
      
      const employeeId = await addEmployee({
        username: newEmployee.username,
        email: newEmployee.email,
        password: newEmployee.password,
        role: newEmployee.role,
        isActive: true
      })
      
      console.log('✅ Funcionário adicionado com sucesso, ID:', employeeId)
      
      // Verificar se realmente foi criado
      setTimeout(async () => {
        try {
          const { getEmployees } = await import('@/lib/funcionario-sync')
          const employees = await getEmployees()
          console.log('📊 Funcionários após criação:', employees)
          
          const createdEmployee = employees.find(e => e.id === employeeId)
          if (createdEmployee) {
            console.log('✅ Funcionário confirmado na lista:', createdEmployee)
            alert(`✅ Funcionário "${newEmployee.username}" criado com sucesso!\n\nAgora você pode fazer login com essas credenciais:\n\nUsuário: ${newEmployee.username}\nSenha: ${newEmployee.password}\n\nID: ${employeeId}`)
          } else {
            console.log('❌ Funcionário não encontrado na lista após criação')
            alert(`⚠️ Funcionário criado mas não sincronizado.\n\nID: ${employeeId}\n\nTente recarregar a página.`)
          }
        } catch (verifyError) {
          console.error('❌ Erro ao verificar funcionário:', verifyError)
          alert(`✅ Funcionário criado!\n\nID: ${employeeId}\n\nMas houve erro na verificação.`)
        }
      }, 1000)
      
      setNewEmployee({ username: "", email: "", password: "", role: "funcionario" })
      setIsAddDialogOpen(false)
    } catch (error: any) {
      console.error('❌ Erro ao adicionar funcionário:', error)
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao adicionar funcionário'
      
      if (error.message.includes('Acesso negado')) {
        errorMessage = '❌ Acesso negado pelo Firebase. Verifique as regras de segurança no Firebase Console.'
      } else if (error.message.includes('já existe')) {
        errorMessage = '❌ Um funcionário com este username já existe. Tente outro username.'
      } else if (error.message.includes('indisponível')) {
        errorMessage = '❌ Firebase temporariamente indisponível. Tente novamente em alguns segundos.'
      } else if (error.message.includes('Dados obrigatórios')) {
        errorMessage = '❌ Por favor, preencha todos os campos obrigatórios.'
      } else {
        errorMessage = `❌ Erro: ${error.message}`
      }
      
      alert(errorMessage)
    }
  }

  const handleEditEmployee = async () => {
    if (!editingEmployee || !editEmployee.username || !editEmployee.email) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    try {
      const updates: any = {
        username: editEmployee.username,
        email: editEmployee.email,
        role: editEmployee.role
      }

      if (editEmployee.password) {
        updates.password = editEmployee.password
      }

      await updateEmployee(editingEmployee.id, updates)
      
      setEditingEmployee(null)
      setEditEmployee({ username: "", email: "", password: "", role: "funcionario" })
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error)
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployee(employeeId)
    } catch (error) {
      console.error('Erro ao excluir funcionário:', error)
    }
  }

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee)
    setEditEmployee({
      username: employee.username,
      email: employee.email,
      password: "",
      role: employee.role
    })
    setIsEditDialogOpen(true)
  }

  const filteredEmployees = employees.filter(employee =>
    employee.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role: string) => {
    return role === 'dev' ? (
      <Badge className="bg-purple-600/20 text-purple-400 border-purple-600/30">
        <Crown className="w-3 h-3 mr-1" />
        Dev
      </Badge>
    ) : (
      <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
        <User className="w-3 h-3 mr-1" />
        Funcionário
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="bg-black/30 border-red-600/20 p-6">
          <div className="text-center">
            <p className="text-red-400 mb-4">Erro ao carregar funcionários</p>
            <p className="text-gray-400 text-sm mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Tentar Novamente
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Gerenciar Funcionários</h1>
          <p className="text-gray-400">Adicione, edite e gerencie usuários do sistema</p>
          <div className="flex items-center mt-2">

            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-green-400">Usuário dev criado na nuvem</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              console.log('🧪 Teste: Funcionários atuais:', employees)
              alert(`🧪 Teste do Sistema:\n\nTotal de funcionários: ${employees.length}\n\nFuncionários:\n${employees.map(e => `- ${e.username} (${e.role})`).join('\n')}`)
            }}
            variant="outline"
            className="border-blue-600/20 text-blue-400 hover:bg-blue-600/10"
          >
            🧪 Testar Sistema
          </Button>
          
          <Button 
            onClick={async () => {
              try {
                console.log('🔍 Debug: Verificando Firebase...')
                const { getEmployees } = await import('@/lib/funcionario-sync')
                const firebaseEmployees = await getEmployees()
                console.log('📊 Funcionários no Firebase:', firebaseEmployees)
                
                alert(`🔍 Debug Firebase:\n\nTotal no Firebase: ${firebaseEmployees.length}\n\nFuncionários:\n${firebaseEmployees.map(e => `- ${e.username} (${e.role}) - ID: ${e.id}`).join('\n')}\n\n\nTotal na interface: ${employees.length}`)
              } catch (error: any) {
                console.error('❌ Erro no debug:', error)
                alert(`❌ Erro no debug:\n${error.message}`)
              }
            }}
            variant="outline"
            className="border-yellow-600/20 text-yellow-400 hover:bg-yellow-600/10"
          >
            🔍 Debug Firebase
          </Button>
          
          <Button 
            onClick={async () => {
              const username = prompt('Digite o username para testar:')
              const password = prompt('Digite a senha para testar:')
              
              if (!username || !password) {
                alert('❌ Username e senha são obrigatórios')
                return
              }
              
              try {
                console.log('🧪 Testando login:', { username, password })
                const result = await testEmployeeLogin(username, password)
                console.log('🧪 Resultado do teste:', result)
                
                if (result.success) {
                  alert(`✅ Login VÁLIDO!\n\nUsuário: ${username}\nSenha: ${password}\n\nDados:\n${JSON.stringify(result.details, null, 2)}`)
                } else {
                  alert(`❌ Login INVÁLIDO!\n\nUsuário: ${username}\nSenha: ${password}\n\nDetalhes:\n${JSON.stringify(result.details, null, 2)}`)
                }
              } catch (error: any) {
                console.error('❌ Erro no teste:', error)
                alert(`❌ Erro no teste:\n${error.message}`)
              }
            }}
            variant="outline"
            className="border-purple-600/20 text-purple-400 hover:bg-purple-600/10"
          >
            🧪 Testar Login
          </Button>
          
          <Button 
            onClick={async () => {
              try {
                console.log('🔄 Iniciando sincronização...')
                
                // Mostrar loading
                const button = event?.target as HTMLButtonElement
                if (button) {
                  button.textContent = '🔄 Sincronizando...'
                  button.setAttribute('disabled', 'true')
                }
                
                const result = await syncEmployeesToFirebase()
                console.log('✅ Resultado da sincronização:', result)
                
                if (result.success) {
                  alert(`✅ Sincronização Concluída!\n\n${result.details.message}\n\nDetalhes:\n${JSON.stringify(result.details, null, 2)}`)
                  
                  // Recarregar lista de funcionários
                  window.location.reload()
                } else {
                  alert(`❌ Erro na Sincronização!\n\n${result.details.error}`)
                }
              } catch (error: any) {
                console.error('❌ Erro na sincronização:', error)
                alert(`❌ Erro na sincronização:\n${error.message}`)
              } finally {
                // Restaurar botão
                const button = document.querySelector('[data-sync="true"]') as HTMLButtonElement
                if (button) {
                  button.textContent = '🔄 Sincronizar Firebase'
                  button.removeAttribute('disabled')
                }
              }
            }}
            variant="outline"
            className="border-green-600/20 text-green-400 hover:bg-green-600/10"
            data-sync="true"
          >
            🔄 Sincronizar Firebase
          </Button>
          
          <Button 
            onClick={async () => {
              try {
                console.log('🔄 Forçando criação do usuário dev...')
                await forceCreateDevUser()
                alert('✅ Usuário dev criado com sucesso!\n\nCredenciais:\nUsuário: dev\nSenha: dev')
                // Recarregar lista
                window.location.reload()
              } catch (error: any) {
                console.error('❌ Erro:', error)
                alert(`❌ Erro ao criar usuário dev:\n${error.message}`)
              }
            }}
            variant="outline"
            className="border-green-600/20 text-green-400 hover:bg-green-600/10"
          >
            🔧 Criar Usuário Dev
          </Button>
          
          <Button 
            onClick={async () => {
              try {
                console.log('🧹 Limpando usuários online antigos...')
                await cleanupInactiveOnlineUsers()
                alert('✅ Usuários online antigos (M7, Mllk) foram REMOVIDOS completamente!\n\nSistema limpo!')
                // Recarregar página
                window.location.reload()
              } catch (error: any) {
                console.error('❌ Erro:', error)
                alert(`❌ Erro ao limpar usuários:\n${error.message}`)
              }
            }}
            variant="outline"
            className="border-red-600/20 text-red-400 hover:bg-red-600/10"
          >
            🧹 Limpar Usuários Online
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" />
                Adicionar Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black/90 border-red-600/20">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Novo Funcionário</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Preencha os dados do novo usuário do sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-white">Nome de Usuário</Label>
                  <Input
                    id="username"
                    value={newEmployee.username}
                    onChange={(e) => setNewEmployee({...newEmployee, username: e.target.value})}
                    className="bg-black/50 border-red-600/20 text-white"
                    placeholder="Digite o nome de usuário"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    className="bg-black/50 border-red-600/20 text-white"
                    placeholder="Digite o email"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-white">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                      className="bg-black/50 border-red-600/20 text-white pr-10"
                      placeholder="Digite a senha"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="role" className="text-white">Cargo</Label>
                  <Select value={newEmployee.role} onValueChange={(value: 'dev' | 'funcionario') => setNewEmployee({...newEmployee, role: value})}>
                    <SelectTrigger className="bg-black/50 border-red-600/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-red-600/20">
                      <SelectItem value="funcionario" className="text-white hover:bg-red-600/20">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Funcionário
                        </div>
                      </SelectItem>
                      <SelectItem value="dev" className="text-white hover:bg-red-600/20">
                        <div className="flex items-center">
                          <Crown className="w-4 h-4 mr-2" />
                          Desenvolvedor
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-red-600/20 text-white hover:bg-red-600/10">
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddEmployee} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  data-loading="false"
                >
                  Adicionar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar funcionários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-black/50 border-red-600/20 text-white"
        />
      </div>

      {/* Employees List */}
      <div className="grid gap-4">
        {filteredEmployees.length === 0 ? (
          <Card className="bg-black/30 border-red-600/20">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum funcionário encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredEmployees.map((employee, index) => (
            <Card key={`${employee.id}-${index}`} className="bg-black/30 border-red-600/20 hover:bg-black/40 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-600/20 rounded-full">
                      <UserCheck className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{employee.username}</h3>
                        {getRoleBadge(employee.role)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {employee.email}
                        </div>
                        <div className="flex items-center">
                          <Lock className="w-4 h-4 mr-1" />
                          {employee.password}
                        </div>
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          {employee.isActive ? "Ativo" : "Inativo"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Dialog open={isEditDialogOpen && editingEmployee?.id === employee.id} onOpenChange={setIsEditDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(employee)}
                          className="border-blue-600/20 text-blue-400 hover:bg-blue-600/10"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-black/90 border-red-600/20">
                        <DialogHeader>
                          <DialogTitle className="text-white">Editar Funcionário</DialogTitle>
                          <DialogDescription className="text-gray-400">
                            Atualize os dados do funcionário
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-username" className="text-white">Nome de Usuário</Label>
                            <Input
                              id="edit-username"
                              value={editEmployee.username}
                              onChange={(e) => setEditEmployee({...editEmployee, username: e.target.value})}
                              className="bg-black/50 border-red-600/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-email" className="text-white">Email</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editEmployee.email}
                              onChange={(e) => setEditEmployee({...editEmployee, email: e.target.value})}
                              className="bg-black/50 border-red-600/20 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-password" className="text-white">Nova Senha (deixe em branco para manter a atual)</Label>
                            <div className="relative">
                              <Input
                                id="edit-password"
                                type={showEditPassword ? "text" : "password"}
                                value={editEmployee.password}
                                onChange={(e) => setEditEmployee({...editEmployee, password: e.target.value})}
                                className="bg-black/50 border-red-600/20 text-white pr-10"
                                placeholder="Digite a nova senha"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowEditPassword(!showEditPassword)}
                              >
                                {showEditPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="edit-role" className="text-white">Cargo</Label>
                            <Select value={editEmployee.role} onValueChange={(value: 'dev' | 'funcionario') => setEditEmployee({...editEmployee, role: value})}>
                              <SelectTrigger className="bg-black/50 border-red-600/20 text-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-black border-red-600/20">
                                <SelectItem value="funcionario" className="text-white hover:bg-red-600/20">
                                  <div className="flex items-center">
                                    <User className="w-4 h-4 mr-2" />
                                    Funcionário
                                  </div>
                                </SelectItem>
                                <SelectItem value="dev" className="text-white hover:bg-red-600/20">
                                  <div className="flex items-center">
                                    <Crown className="w-4 h-4 mr-2" />
                                    Desenvolvedor
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-red-600/20 text-white hover:bg-red-600/10">
                            Cancelar
                          </Button>
                          <Button onClick={handleEditEmployee} className="bg-red-600 hover:bg-red-700 text-white">
                            Salvar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-600/20 text-red-400 hover:bg-red-600/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black/90 border-red-600/20">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Tem certeza que deseja excluir o funcionário "{employee.username}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-red-600/20 text-white hover:bg-red-600/10">
                            Cancelar
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/30 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total de Usuários</p>
                <p className="text-2xl font-bold text-white">{totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Desenvolvedores</p>
                <p className="text-2xl font-bold text-purple-400">{devEmployees}</p>
              </div>
              <Crown className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-red-600/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Funcionários</p>
                <p className="text-2xl font-bold text-blue-400">{funcionarioEmployees}</p>
              </div>
              <User className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
