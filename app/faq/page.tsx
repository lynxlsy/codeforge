"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bot,
  Globe,
  Wrench,
  Clock,
  DollarSign,
  Shield,
  MessageCircle,
  Zap,
  Star,
  CheckCircle,
} from "lucide-react"

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqCategories = [
    {
      title: "Serviços",
      icon: Wrench,
      color: "from-blue-500 to-cyan-500",
      items: [
        {
          question: "Quais tipos de bots vocês desenvolvem?",
          answer: "Desenvolvemos bots para Discord, Instagram, WhatsApp, Telegram e sistemas personalizados. Cada bot é criado sob medida para suas necessidades específicas."
        },
        {
          question: "Vocês fazem sites responsivos?",
          answer: "Sim! Todos os nossos sites são desenvolvidos com design responsivo, garantindo uma experiência perfeita em desktop, tablet e mobile."
        },
        {
          question: "Oferecem manutenção dos projetos?",
          answer: "Sim, oferecemos planos de manutenção contínua, atualizações de segurança e suporte técnico para todos os projetos desenvolvidos."
        }
      ]
    },
    {
      title: "Preços e Prazos",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      items: [
        {
          question: "Como funciona o orçamento?",
          answer: "Nosso orçamento é personalizado baseado na complexidade do projeto, funcionalidades necessárias e prazo desejado. Use nosso sistema de cotação online!"
        },
        {
          question: "Qual o prazo médio de entrega?",
          answer: "O prazo varia de 1 a 4 semanas, dependendo da complexidade. Projetos urgentes podem ser priorizados com um pequeno adicional."
        },
        {
          question: "Aceitam pagamento parcelado?",
          answer: "Sim! Oferecemos opções de pagamento flexíveis, incluindo parcelamento sem juros para projetos maiores."
        }
      ]
    },
    {
      title: "Suporte e Comunicação",
      icon: MessageCircle,
      color: "from-purple-500 to-pink-500",
      items: [
        {
          question: "Como posso acompanhar meu projeto?",
          answer: "Você receberá acesso ao nosso sistema de acompanhamento, com atualizações em tempo real e comunicação direta com nossa equipe."
        },
        {
          question: "Qual o tempo de resposta do suporte?",
          answer: "Nosso suporte responde em até 2 horas úteis. Para emergências, temos canais prioritários disponíveis 24/7."
        },
        {
          question: "Oferecem treinamento para usar os sistemas?",
          answer: "Sim! Incluímos treinamento completo e documentação detalhada para que você aproveite ao máximo sua solução."
        }
      ]
    },
    {
      title: "Tecnologia e Segurança",
      icon: Shield,
      color: "from-orange-500 to-red-500",
      items: [
        {
          question: "Quais tecnologias vocês utilizam?",
          answer: "Trabalhamos com as tecnologias mais modernas: React, Node.js, Python, TypeScript, e sempre seguimos as melhores práticas de desenvolvimento."
        },
        {
          question: "Meus dados ficam seguros?",
          answer: "Absolutamente! Implementamos as melhores práticas de segurança, incluindo criptografia, backups regulares e conformidade com LGPD."
        },
        {
          question: "Oferecem backup e recuperação?",
          answer: "Sim, todos os projetos incluem backup automático e plano de recuperação de dados para garantir a segurança das suas informações."
        }
      ]
    }
  ]

  const quickStats = [
    { icon: Clock, label: "Resposta em 2h", value: "Suporte Rápido" },
    { icon: CheckCircle, label: "100% Satisfação", value: "Clientes Felizes" },
    { icon: Zap, label: "Entrega Rápida", value: "Projetos no Prazo" },
    { icon: Star, label: "5.0 Avaliação", value: "Qualidade Garantida" },
  ]

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-background/95">
      <ParticlesBackground particleCount={35} />
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <HelpCircle className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Perguntas Frequentes</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Dúvidas? <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Respostas!</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Encontre respostas para as perguntas mais comuns sobre nossos serviços e processos
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">{stat.label}</div>
                    <div className="text-sm text-gray-400">{stat.value}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* FAQ Categories */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Categorias <span className="text-primary">Organizadas</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Navegue pelas categorias e encontre exatamente o que você procura
              </p>
            </div>

            <div className="space-y-8">
              {faqCategories.map((category, categoryIndex) => {
                const Icon = category.icon
                return (
                  <Card key={category.title} className="bg-black/20 border border-white/5 backdrop-blur-sm">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color} w-16 h-16 flex items-center justify-center`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                          <p className="text-gray-400">Perguntas sobre {category.title.toLowerCase()}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {category.items.map((item, itemIndex) => {
                          const globalIndex = categoryIndex * 3 + itemIndex
                          const isOpen = openItems.includes(globalIndex)
                          
                          return (
                            <Collapsible 
                              key={itemIndex}
                              open={isOpen}
                              onOpenChange={() => toggleItem(globalIndex)}
                            >
                              <CollapsibleTrigger asChild>
                                <Card className="bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer">
                                  <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-lg font-semibold text-white text-left pr-4">
                                        {item.question}
                                      </h4>
                                      <div className="flex-shrink-0">
                                        {isOpen ? (
                                          <ChevronUp className="h-5 w-5 text-primary" />
                                        ) : (
                                          <ChevronDown className="h-5 w-5 text-primary" />
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </CollapsibleTrigger>
                              
                              <CollapsibleContent>
                                <Card className="mt-2 bg-primary/5 border border-primary/20">
                                  <CardContent className="p-6">
                                    <p className="text-gray-300 leading-relaxed">
                                      {item.answer}
                                    </p>
                                  </CardContent>
                                </Card>
                              </CollapsibleContent>
                            </Collapsible>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 backdrop-blur-sm">
              <CardContent className="p-16">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ainda tem <span className="text-primary">dúvidas?</span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Nossa equipe está pronta para responder todas as suas perguntas e ajudar você a encontrar a melhor solução
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contato" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Falar com Especialista
                  </a>
                  
                  <a 
                    href="/categorias" 
                    className="inline-flex items-center justify-center px-8 py-4 border border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <Globe className="h-5 w-5 mr-2" />
                    Ver Nossos Serviços
                  </a>
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
