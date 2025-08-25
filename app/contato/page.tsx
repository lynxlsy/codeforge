"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Mail,
  MessageCircle,
  Hash,
  Send,
  ExternalLink,
  Clock,
  MapPin,
  Users,
  Sparkles,
  Instagram,
  CheckCircle,
  Shield,
} from "lucide-react"
import { useContactConfig } from "@/hooks/use-contact-config"

interface ContactCard {
  id: string
  name: string
  type: 'whatsapp' | 'email' | 'instagram' | 'telegram' | 'discord'
  value: string
  link: string
  icon: any
  color: string
  bgColor: string
  gradient: string
  description: string
  active: boolean
  responseTime: string
  features: string[]
}

export default function ContatoPage() {
  const { 
    config, 
    getActiveContactsCount,
    openWhatsApp, 
    openEmail, 
    openInstagram, 
    openTelegram, 
    openDiscord,
    loading 
  } = useContactConfig()

  const [contactCards, setContactCards] = useState<ContactCard[]>([])

  useEffect(() => {
    if (!loading) {
      const cards: ContactCard[] = []

      // Email (Primeiro - mais profissional)
      if (config.emailActive) {
        cards.push({
          id: 'email',
          name: 'Email',
          type: 'email',
          value: config.email,
          link: `mailto:${config.email}`,
          icon: Mail,
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          gradient: 'from-blue-500/20 to-cyan-500/20',
          description: 'Contato profissional para projetos complexos',
          active: config.emailActive,
          responseTime: 'Até 24h',
          features: ['Documentação detalhada', 'Propostas formais', 'Suporte técnico']
        })
      }

      // WhatsApp (Segundo - mais popular)
      if (config.whatsappActive) {
        cards.push({
          id: 'whatsapp',
          name: 'WhatsApp',
          type: 'whatsapp',
          value: config.whatsappNumber || '(11) 99999-9999',
          link: config.whatsappLink,
          icon: MessageCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          gradient: 'from-green-500/20 to-emerald-500/20',
          description: 'Atendimento rápido e direto',
          active: config.whatsappActive,
          responseTime: 'Imediato',
          features: ['Resposta rápida', 'Áudio e vídeo', 'Compartilhamento de arquivos']
        })
      }

      // Discord (Terceiro - comunidade)
      if (config.discordActive) {
        cards.push({
          id: 'discord',
          name: 'Discord',
          type: 'discord',
          value: 'Comunidade CDforge',
          link: config.discordLink,
          icon: Hash,
          color: 'text-indigo-400',
          bgColor: 'bg-indigo-500/10',
          gradient: 'from-indigo-500/20 to-purple-500/20',
          description: 'Entre em nossa comunidade de desenvolvedores',
          active: config.discordActive,
          responseTime: 'Até 2h',
          features: ['Comunidade ativa', 'Canais especializados', 'Eventos e workshops']
        })
      }

      // Telegram (Quarto - alternativa)
      if (config.telegramActive) {
        cards.push({
          id: 'telegram',
          name: 'Telegram',
          type: 'telegram',
          value: config.telegramNumber || '@cdforge',
          link: config.telegramLink,
          icon: Send,
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/10',
          gradient: 'from-cyan-500/20 to-blue-500/20',
          description: 'Canal oficial para comunicação',
          active: config.telegramActive,
          responseTime: 'Até 4h',
          features: ['Mensagens seguras', 'Grupos organizados', 'Notificações push']
        })
      }

      // Instagram (Quinto - redes sociais)
      if (config.instagramActive) {
        cards.push({
          id: 'instagram',
          name: 'Instagram',
          type: 'instagram',
          value: '@cdforge',
          link: config.instagramLink,
          icon: Instagram,
          color: 'text-pink-400',
          bgColor: 'bg-pink-500/10',
          gradient: 'from-pink-500/20 to-rose-500/20',
          description: 'Siga nossos projetos e novidades',
          active: config.instagramActive,
          responseTime: 'Até 12h',
          features: ['Portfolio visual', 'Stories diários', 'Dicas de desenvolvimento']
        })
      }

      setContactCards(cards)
    }
  }, [config, loading])

  const handleContactClick = (card: ContactCard) => {
    switch (card.type) {
      case 'whatsapp':
        openWhatsApp()
        break
      case 'email':
        openEmail()
        break
      case 'instagram':
        openInstagram()
        break
      case 'telegram':
        openTelegram()
        break
      case 'discord':
        openDiscord()
        break
    }
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-background/95">
      <ParticlesBackground particleCount={30} />
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Estamos online</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Vamos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Conversar</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Escolha o canal de sua preferência para conversarmos sobre seu projeto. 
              Estamos sempre disponíveis para transformar suas ideias em realidade.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{getActiveContactsCount()}</div>
                <div className="text-sm text-gray-400">Canais Ativos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-gray-400">Disponibilidade</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-gray-400">Satisfação</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Cards Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
                  <p className="text-gray-400 text-lg">Carregando contatos...</p>
                </div>
              </div>
            ) : contactCards.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8">
                  <Phone className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Nenhum Contato Disponível</h3>
                <p className="text-gray-400 max-w-md mx-auto text-lg">
                  Configure os contatos na área de desenvolvimento para exibi-los aqui.
                </p>
              </div>
            ) : (
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 contact-cards-container">
                {contactCards.map((card) => {
                  const Icon = card.icon
                  return (
                                         <Card 
                       key={card.id}
                       className="group relative overflow-hidden bg-black/20 border border-white/5 backdrop-blur-sm hover:bg-black/30 hover:border-primary/30 contact-card-hover cursor-pointer"
                       onClick={() => handleContactClick(card)}
                     >
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      {/* Content */}
                      <CardContent className="relative p-8">
                        <div className="flex flex-col h-full">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                                             <div className={`p-4 rounded-2xl ${card.bgColor} flex-shrink-0 w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                 <Icon className={`h-8 w-8 ${card.color} contact-icon-glow`} />
                               </div>
                              <div>
                                <h3 className="text-2xl font-bold text-white mb-1">{card.name}</h3>
                                <div className="flex items-center gap-2">
                                                                     <Badge 
                                     variant="outline" 
                                     className="border-green-500/30 text-green-400 bg-green-500/10 contact-badge-pulse"
                                   >
                                     Ativo
                                   </Badge>
                                  <div className="flex items-center gap-1 text-sm text-gray-400">
                                    <Clock className="h-3 w-3" />
                                    {card.responseTime}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                            {card.description}
                          </p>

                          {/* Contact Info */}
                          <div className="bg-white/5 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm text-gray-400">Contato:</span>
                                <div className="text-white font-semibold text-lg">{card.value}</div>
                              </div>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">Recursos</h4>
                            <div className="flex flex-wrap gap-2">
                              {card.features.map((feature, index) => (
                                <span 
                                  key={index}
                                  className="text-xs bg-white/5 text-gray-300 px-3 py-1 rounded-full border border-white/10"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="mt-auto">
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all duration-300"
                            >
                              <ExternalLink className="h-5 w-5 mr-2" />
                              Abrir {card.name}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </section>

                 {/* Additional Info Section */}
         <section className="py-20 bg-muted/30">
           <div className="container mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="font-serif font-black text-3xl md:text-5xl text-foreground mb-6">
                 Por que escolher a <span className="text-primary">CodeForge</span>?
               </h2>
               <p className="text-lg text-muted-foreground">
                 Combinamos expertise técnica com atendimento personalizado para entregar soluções que realmente fazem a
                 diferença.
               </p>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="text-center group hover:shadow-lg transition-all duration-300">
                 <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                   <CheckCircle className="h-6 w-6 text-primary" />
                 </div>
                 <h3 className="text-lg font-serif font-bold text-foreground mb-2">Qualidade Garantida</h3>
                 <p className="text-muted-foreground">Código limpo, documentado e testado para máxima confiabilidade</p>
               </div>
               
               <div className="text-center group hover:shadow-lg transition-all duration-300">
                 <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                   <Clock className="h-6 w-6 text-primary" />
                 </div>
                 <h3 className="text-lg font-serif font-bold text-foreground mb-2">Entrega Rápida</h3>
                 <p className="text-muted-foreground">Prazos otimizados sem comprometer a qualidade do projeto</p>
               </div>
               
               <div className="text-center group hover:shadow-lg transition-all duration-300">
                 <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                   <Shield className="h-6 w-6 text-primary" />
                 </div>
                 <h3 className="text-lg font-serif font-bold text-foreground mb-2">Segurança Total</h3>
                 <p className="text-muted-foreground">Implementação de melhores práticas de segurança digital</p>
               </div>
               
               <div className="text-center group hover:shadow-lg transition-all duration-300">
                 <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                   <Users className="h-6 w-6 text-primary" />
                 </div>
                 <h3 className="text-lg font-serif font-bold text-foreground mb-2">Suporte Dedicado</h3>
                 <p className="text-muted-foreground">Acompanhamento completo durante e após o desenvolvimento</p>
               </div>
             </div>
           </div>
         </section>
      </main>

      <Footer />
    </div>
  )
}
