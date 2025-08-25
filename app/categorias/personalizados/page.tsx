import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProjectFlow } from "@/components/project-flow/project-flow"

export default function PersonalizadosPage() {
  const customServices = [
    {
      id: "api",
      name: "API Personalizada",
      description: "Desenvolvimento de APIs REST ou GraphQL sob medida",
      basePrice: 70,
      features: ["Documentação", "Autenticação", "Rate Limiting", "Monitoramento", "Versionamento"],
    },
    {
      id: "integration",
      name: "Integrações",
      description: "Conecte diferentes sistemas e plataformas",
      basePrice: 40,
      features: ["APIs Terceiros", "Webhooks", "Sincronização", "Logs", "Monitoramento"],
    },
    {
      id: "automation",
      name: "Automação de Processos",
      description: "Automatize tarefas repetitivas do seu negócio",
      basePrice: 55,
      features: ["Scripts Personalizados", "Agendamento", "Notificações", "Relatórios", "Dashboard"],
    },
    {
      id: "consulting",
      name: "Consultoria Técnica",
      description: "Orientação especializada para seus projetos",
      basePrice: 25,
      features: ["Análise de Requisitos", "Arquitetura", "Code Review", "Mentoria", "Documentação"],
    },
    {
      id: "maintenance",
      name: "Manutenção e Suporte",
      description: "Manutenção contínua de sistemas existentes",
      basePrice: 30,
      features: ["Correção de Bugs", "Atualizações", "Monitoramento", "Backup", "Suporte 24/7"],
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ProjectFlow
          category="personalizados"
          title="Serviços Personalizados"
          description="Descreva sua necessidade específica e receba uma solução sob medida"
          platforms={customServices}
        />
      </main>
      <Footer />
    </div>
  )
}
