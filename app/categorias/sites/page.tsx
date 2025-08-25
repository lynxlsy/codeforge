import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProjectFlow } from "@/components/project-flow/project-flow"

export default function SitesPage() {
  const siteTypes = [
    {
      id: "landing",
      name: "Landing Page",
      description: "Página de conversão otimizada para seu produto ou serviço",
      basePrice: 30,
      features: ["Design Responsivo", "SEO Otimizado", "Formulários", "Analytics", "Hospedagem"],
    },
    {
      id: "ecommerce",
      name: "E-commerce",
      description: "Loja virtual completa com sistema de pagamentos",
      basePrice: 70,
      features: ["Catálogo de Produtos", "Carrinho", "Pagamentos", "Gestão de Pedidos", "Dashboard Admin"],
    },
    {
      id: "portfolio",
      name: "Portfólio",
      description: "Site profissional para apresentar seus trabalhos",
      basePrice: 25,
      features: ["Galeria", "Sobre", "Contato", "Blog", "Responsivo"],
    },
    {
      id: "corporate",
      name: "Site Corporativo",
      description: "Presença digital profissional para sua empresa",
      basePrice: 50,
      features: ["Múltiplas Páginas", "CMS", "Blog", "Formulários", "Integrações"],
    },
    {
      id: "webapp",
      name: "Aplicação Web",
      description: "Sistema web personalizado para seu negócio",
      basePrice: 70,
      features: ["Dashboard", "Autenticação", "Banco de Dados", "APIs", "Relatórios"],
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ProjectFlow
          category="sites"
          title="Desenvolvimento de Sites"
          description="Selecione o tipo de site e especifique as funcionalidades necessárias"
          platforms={siteTypes}
        />
      </main>
      <Footer />
    </div>
  )
}
