import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProjectFlow } from "@/components/project-flow/project-flow"

export default function BotsPage() {
  const botPlatforms = [
    {
      id: "discord",
      name: "Discord Bot",
      description: "Bots para servidores Discord com comandos personalizados",
      basePrice: 25,
      features: ["Comandos Slash", "Moderação", "Música", "Jogos", "Integrações"],
    },
    {
      id: "instagram",
      name: "Instagram Bot",
      description: "Automação para Instagram com funcionalidades avançadas",
      basePrice: 45,
      features: ["Auto Follow/Unfollow", "Comentários", "Stories", "DM Automation", "Analytics"],
    },
    {
      id: "whatsapp",
      name: "WhatsApp Bot",
      description: "Chatbots para WhatsApp Business com IA integrada",
      basePrice: 35,
      features: ["Respostas Automáticas", "Menu Interativo", "Integração CRM", "Relatórios", "Multi-atendimento"],
    },
    {
      id: "telegram",
      name: "Telegram Bot",
      description: "Bots para Telegram com funcionalidades personalizadas",
      basePrice: 20,
      features: ["Comandos Inline", "Keyboards", "Pagamentos", "Grupos", "Canais"],
    },
    {
      id: "custom",
      name: "Sistema",
      description: "Automação customizada para suas necessidades específicas",
      basePrice: 65,
      features: ["APIs Customizadas", "Integrações", "Dashboard", "Relatórios", "Suporte Dedicado"],
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ProjectFlow
          category="bots"
          title="Desenvolvimento de Bots"
          description="Escolha a plataforma e detalhe as funcionalidades que precisa para seu bot"
          platforms={botPlatforms}
        />
      </main>
      <Footer />
    </div>
  )
}
