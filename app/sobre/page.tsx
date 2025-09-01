"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
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
              <span className="text-sm text-primary font-medium">Trio Forge</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Conheça o <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Trio Forge</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Somos especialistas focados em administrar seu negócio, fazer você alavancar e resolver problemas com soluções digitais inovadoras.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
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
                Conheça os especialistas que formam o Trio Forge e estão prontos para transformar seu negócio
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Melke */}
              <Card className="bg-gradient-to-br from-blue-600/10 to-blue-700/10 border border-blue-600/20 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-12 w-12 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Melke</h3>
                  <Badge className="bg-blue-600/20 text-blue-300 border border-blue-600/30 mb-4">
                    Desenvolvedor Full-Stack
                  </Badge>
                  <p className="text-gray-300 leading-relaxed">
                    Especialista em desenvolvimento de sites e automações. Transforma ideias em soluções digitais inovadoras com tecnologia de ponta.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Badge variant="outline" className="text-xs border-blue-600/30 text-blue-300">
                      Sites
                    </Badge>
                    <Badge variant="outline" className="text-xs border-blue-600/30 text-blue-300">
                      Automações
                    </Badge>
                    <Badge variant="outline" className="text-xs border-blue-600/30 text-blue-300">
                      Full-Stack
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Zanesco */}
              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 border border-purple-600/20 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-12 w-12 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Zanesco</h3>
                  <Badge className="bg-purple-600/20 text-purple-300 border border-purple-600/30 mb-4">
                    Criador & Desenvolvedor
                  </Badge>
                  <p className="text-gray-300 leading-relaxed">
                    Desenvolvedor e criador de bots, design e serviços. Mestre em criar soluções inteligentes que revolucionam a experiência digital.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Badge variant="outline" className="text-xs border-purple-600/30 text-purple-300">
                      Bots
                    </Badge>
                    <Badge variant="outline" className="text-xs border-purple-600/30 text-purple-300">
                      Design
                    </Badge>
                    <Badge variant="outline" className="text-xs border-purple-600/30 text-purple-300">
                      Serviços
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Pedro */}
              <Card className="bg-gradient-to-br from-green-600/10 to-green-700/10 border border-green-600/20 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="bg-gradient-to-br from-green-600/20 to-green-700/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-12 w-12 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pedro</h3>
                  <Badge className="bg-green-600/20 text-green-300 border border-green-600/30 mb-4">
                    Agente Oficial
                  </Badge>
                  <p className="text-gray-300 leading-relaxed">
                    Especialista em assistência de bots, negociações e vendas. Garante que cada cliente tenha a melhor experiência e solução personalizada.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Badge variant="outline" className="text-xs border-green-600/30 text-green-300">
                      Assistência
                    </Badge>
                    <Badge variant="outline" className="text-xs border-green-600/30 text-green-300">
                      Negociações
                    </Badge>
                    <Badge variant="outline" className="text-xs border-green-600/30 text-green-300">
                      Vendas
                    </Badge>
                  </div>
                </CardContent>
              </Card>
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
