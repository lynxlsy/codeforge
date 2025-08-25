import Link from "next/link"
import { Bot, Globe, Wrench, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function CategoriesGrid() {
  const categories = [
    {
      id: "bots",
      title: "Bots",
      description: "Automação inteligente para Discord, Instagram, WhatsApp e sistemas personalizados",
      icon: Bot,
      features: ["Discord Bots", "Instagram Automation", "WhatsApp Bots", "Sistemas Personalizados"],
      href: "/categorias/bots",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "sites",
      title: "Sites",
      description: "Desenvolvimento web moderno, responsivo e otimizado para seu negócio",
      icon: Globe,
      features: ["Landing Pages", "E-commerce", "Portfólios", "Sistemas Web"],
      href: "/categorias/sites",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "personalizados",
      title: "Serviços Personalizados",
      description: "Soluções sob medida para necessidades específicas do seu projeto",
      icon: Wrench,
      features: ["APIs Customizadas", "Integrações", "Consultoria", "Manutenção"],
      href: "/categorias/personalizados",
      color: "from-purple-500 to-pink-500",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/20 h-full flex flex-col cursor-pointer"
            >
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 w-fit group-hover:scale-110 transition-transform">
                  <category.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl font-serif font-bold">{category.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">{category.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Principais Serviços
                  </h4>
                  <ul className="space-y-1">
                    {category.features.map((feature, index) => (
                      <li key={index} className="text-sm text-foreground/80 flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                  <Link href={category.href}>
                    Começar Projeto
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <div className="bg-muted/50 rounded-xl p-8">
            <h3 className="font-serif font-bold text-2xl mb-4">Como funciona nosso processo?</h3>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto">
                  1
                </div>
                <h4 className="font-semibold">Escolha a Categoria</h4>
                <p className="text-muted-foreground">Selecione o tipo de serviço que precisa</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto">
                  2
                </div>
                <h4 className="font-semibold">Detalhe seu Projeto</h4>
                <p className="text-muted-foreground">Preencha informações sobre suas necessidades</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mx-auto">
                  3
                </div>
                <h4 className="font-semibold">Receba seu Orçamento</h4>
                <p className="text-muted-foreground">Obtenha preço e prazo estimados instantaneamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
