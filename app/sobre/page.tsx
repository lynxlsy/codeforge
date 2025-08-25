"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Bot,
  ShoppingCart,
  Users,
  Sparkles,
  Target,
  Zap,
  Shield,
  TrendingUp,
  Heart,
  Star,
  Award,
} from "lucide-react"

export default function SobrePage() {
  const founders = [
    {
      name: "Melke",
      role: "Tech Lead & Designer",
      specialties: ["Sites & HTML", "Automação de Códigos", "Design UI/UX"],
      description: "Especialista em desenvolvimento web e design criativo. Transforma ideias em interfaces incríveis.",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      name: "Zanesco",
      role: "Bot Master",
      specialties: ["Criação de Bots", "Automação Avançada", "Sistemas Inteligentes"],
      description: "Mestre na criação de bots inteligentes e automações que revolucionam processos.",
      icon: Bot,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      name: "Pedro",
      role: "Sales & Support Lead",
      specialties: ["Vendas", "Suporte Técnico", "Gestão de Clientes"],
      description: "Líder em vendas e suporte, garante que cada cliente tenha a melhor experiência possível.",
      icon: ShoppingCart,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      name: "MEC",
      role: "Business Partner",
      specialties: ["Gestão Comercial", "Estratégia", "Parcerias"],
      description: "Sócio estratégico focado em expandir negócios e criar parcerias de sucesso.",
      icon: Users,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ]

  const values = [
    {
      icon: Target,
      title: "Foco no Cliente",
      description: "Cada projeto é único e merece atenção especial"
    },
    {
      icon: Zap,
      title: "Inovação Constante",
      description: "Sempre buscando as melhores tecnologias"
    },
    {
      icon: Shield,
      title: "Qualidade Garantida",
      description: "Compromisso com excelência em tudo que fazemos"
    },
    {
      icon: TrendingUp,
      title: "Crescimento Sustentável",
      description: "Ajudamos seu negócio a crescer de forma inteligente"
    }
  ]

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-background/95">
      <ParticlesBackground particleCount={40} />
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Quarteto Forge</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Conheça o <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Quarteto Forge</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Somos especialistas focados em administrar seu negócio, fazer você alavancar e resolver problemas com soluções digitais inovadoras.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4</div>
                <div className="text-sm text-gray-400">Fundadores Especialistas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-gray-400">Compromisso</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-gray-400">Possibilidades</div>
              </div>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Nossa <span className="text-primary">Equipe</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Conheça os especialistas que formam o Quarteto Forge e estão prontos para transformar seu negócio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {founders.map((founder, index) => {
                const Icon = founder.icon
                return (
                  <Card 
                    key={founder.name}
                    className="group relative overflow-hidden bg-black/20 border border-white/5 backdrop-blur-sm hover:bg-black/30 hover:border-primary/30 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${founder.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <CardContent className="relative p-8 text-center">
                      {/* Avatar */}
                      <div className={`mx-auto mb-6 p-6 rounded-full ${founder.bgColor} w-24 h-24 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-12 w-12 ${founder.color.replace('from-', 'text-').replace(' to-', '')}`} />
                      </div>
                      
                      {/* Name & Role */}
                      <h3 className="text-2xl font-bold text-white mb-2">{founder.name}</h3>
                      <p className="text-primary font-semibold mb-4">{founder.role}</p>
                      
                      {/* Description */}
                      <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                        {founder.description}
                      </p>
                      
                      {/* Specialties */}
                      <div className="space-y-2">
                        {founder.specialties.map((specialty, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className={`text-xs ${founder.borderColor} bg-transparent`}
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Nossos <span className="text-primary">Valores</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Princípios que guiam cada decisão e projeto que desenvolvemos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={value.title} className="text-center group">
                    <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 backdrop-blur-sm">
              <CardContent className="p-16">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
                  <Heart className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Nossa <span className="text-primary">Missão</span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Transformar ideias em soluções digitais inovadoras, ajudando empresas a crescer e resolver problemas complexos com tecnologia de ponta.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge className="bg-primary text-white px-4 py-2">
                    <Star className="h-4 w-4 mr-2" />
                    Inovação
                  </Badge>
                  <Badge className="bg-primary text-white px-4 py-2">
                    <Award className="h-4 w-4 mr-2" />
                    Excelência
                  </Badge>
                  <Badge className="bg-primary text-white px-4 py-2">
                    <Users className="h-4 w-4 mr-2" />
                    Colaboração
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
