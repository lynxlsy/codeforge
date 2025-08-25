"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Construction,
  Sparkles,
  Clock,
  Zap,
  TrendingUp,
} from "lucide-react"

export default function PlanosPage() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-background/95">
      <ParticlesBackground particleCount={30} />
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Construction className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Em desenvolvimento</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Planos</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Estamos trabalhando para oferecer as melhores opções de planos e preços para nossos clientes.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">3</div>
                <div className="text-sm text-gray-400">Planos Disponíveis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Flexível</div>
                <div className="text-sm text-gray-400">Escalabilidade</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-gray-400">Suporte</div>
              </div>
            </div>
          </div>
        </section>

        {/* Em Produção Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-black/20 border border-primary/20 backdrop-blur-sm">
              <CardContent className="p-16 text-center">
                <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                  <Construction className="h-12 w-12 text-primary" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  🚧 Em Produção
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Nossa equipe está trabalhando arduamente para criar planos personalizados 
                  que atendam às necessidades específicas de cada projeto.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Desenvolvimento</h3>
                    <p className="text-gray-400">Criando planos personalizados</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Testes</h3>
                    <p className="text-gray-400">Validando preços e recursos</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">Lançamento</h3>
                    <p className="text-gray-400">Em breve disponível</p>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    💡 Enquanto isso...
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Entre em contato conosco para discutir seu projeto e receber uma proposta personalizada!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Badge 
                      variant="outline" 
                      className="border-green-500/30 text-green-400 bg-green-500/10 px-4 py-2"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Propostas Personalizadas
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className="border-blue-500/30 text-blue-400 bg-blue-500/10 px-4 py-2"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Consultoria Gratuita
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 border-t border-white/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
              Pronto para começar seu projeto?
            </h2>
            
            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
              Nossa equipe está pronta para transformar suas ideias em realidade. 
              Entre em contato e vamos discutir as melhores opções para seu projeto.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contato" 
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Falar com Especialista
              </a>
              
              <a 
                href="/categorias" 
                className="inline-flex items-center justify-center px-8 py-4 border border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
              >
                Ver Nossos Serviços
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
