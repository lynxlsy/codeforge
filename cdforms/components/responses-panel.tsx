"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Download, Users, FileText, TrendingUp } from "lucide-react"

export function ResponsesPanel() {
  // Mock data for demonstration
  const stats = {
    totalResponses: 127,
    completionRate: 89,
    averageTime: "3m 42s",
  }

  const chartData = [
    { name: "Opção 1", value: 45, color: "#3b82f6" },
    { name: "Opção 2", value: 32, color: "#60a5fa" },
    { name: "Opção 3", value: 28, color: "#93c5fd" },
    { name: "Opção 4", value: 22, color: "#dbeafe" },
  ]

  const timeData = [
    { day: "Seg", responses: 12 },
    { day: "Ter", responses: 19 },
    { day: "Qua", responses: 15 },
    { day: "Qui", responses: 25 },
    { day: "Sex", responses: 32 },
    { day: "Sáb", responses: 18 },
    { day: "Dom", responses: 6 },
  ]

  const recentResponses = [
    { id: 1, timestamp: "2024-01-15 14:30", status: "Completa" },
    { id: 2, timestamp: "2024-01-15 14:25", status: "Completa" },
    { id: 3, timestamp: "2024-01-15 14:20", status: "Incompleta" },
    { id: 4, timestamp: "2024-01-15 14:15", status: "Completa" },
    { id: 5, timestamp: "2024-01-15 14:10", status: "Completa" },
  ]

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-gray-900">Respostas do Formulário</h1>
          <p className="text-gray-600 mt-1">Análise e visualização das respostas coletadas</p>
        </div>
        <Button className="bg-primary hover:bg-accent">
          <Download className="w-4 h-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Respostas</p>
                <p className="text-3xl font-heading font-bold text-gray-900">{stats.totalResponses}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                <p className="text-3xl font-heading font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tempo Médio</p>
                <p className="text-3xl font-heading font-bold text-gray-900">{stats.averageTime}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="responses">Respostas</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="shadow-md border-0 bg-white">
              <CardHeader>
                <CardTitle className="font-heading">Distribuição de Respostas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="shadow-md border-0 bg-white">
              <CardHeader>
                <CardTitle className="font-heading">Respostas por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={timeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="responses" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="responses">
          <Card className="shadow-md border-0 bg-white">
            <CardHeader>
              <CardTitle className="font-heading">Respostas Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentResponses.map((response) => (
                  <div
                    key={response.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">#{response.id}</span>
                      </div>
                      <div>
                        <p className="font-medium">Resposta #{response.id}</p>
                        <p className="text-sm text-gray-600">{response.timestamp}</p>
                      </div>
                    </div>
                    <Badge
                      variant={response.status === "Completa" ? "default" : "secondary"}
                      className={response.status === "Completa" ? "bg-green-100 text-green-800" : ""}
                    >
                      {response.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
