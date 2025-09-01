"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Sparkles,
  Eye,
  Lock,
  Database,
  Users,
  CheckCircle,
  AlertTriangle,
  Info,
  Heart,
  Star,
  Zap,
  Globe,
  Clock,
} from "lucide-react"

export default function PrivacidadePage() {
  const privacySections = [
    {
      title: "Coleta de Dados",
      icon: Database,
      color: "from-blue-500 to-cyan-500",
      content: [
        "Coletamos apenas dados necessários para prestar nossos serviços.",
        "Informações pessoais incluem nome, email, telefone e dados do projeto.",
        "Não coletamos dados sensíveis sem consentimento explícito.",
        "Utilizamos cookies essenciais para funcionamento do site."
      ]
    },
    {
      title: "Uso dos Dados",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      content: [
        "Seus dados são usados exclusivamente para prestação de serviços.",
        "Comunicação sobre projetos e atualizações importantes.",
        "Melhorias em nossos serviços e experiência do usuário.",
        "Cumprimento de obrigações legais e contratuais."
      ]
    },
    {
      title: "Proteção e Segurança",
      icon: Lock,
      color: "from-purple-500 to-pink-500",
      content: [
        "Implementamos medidas de segurança avançadas.",
        "Criptografia SSL/TLS para transmissão de dados.",
        "Acesso restrito apenas a funcionários autorizados.",
        "Backups regulares e monitoramento contínuo."
      ]
    },
    {
      title: "Compartilhamento",
      icon: Globe,
      color: "from-orange-500 to-red-500",
      content: [
        "Não vendemos, alugamos ou compartilhamos seus dados pessoais.",
        "Parceiros de pagamento recebem apenas dados necessários.",
        "Compartilhamento apenas com consentimento explícito.",
        "Cumprimento de ordens judiciais quando necessário."
      ]
    },
    {
      title: "Seus Direitos (LGPD)",
      icon: CheckCircle,
      color: "from-indigo-500 to-purple-500",
      content: [
        "Acesso aos seus dados pessoais a qualquer momento.",
        "Correção de dados incompletos ou desatualizados.",
        "Exclusão de dados quando solicitado.",
        "Portabilidade dos dados para outros serviços."
      ]
    },
    {
      title: "Retenção de Dados",
      icon: Clock,
      color: "from-yellow-500 to-orange-500",
      content: [
        "Dados são mantidos pelo tempo necessário aos serviços.",
        "Exclusão automática após período de inatividade.",
        "Arquivamento seguro para obrigações legais.",
        "Processo de exclusão definitiva disponível."
      ]
    }
  ]

  const lgpdRights = [
    { icon: Eye, title: "Acesso", description: "Conhecer quais dados temos sobre você" },
    { icon: CheckCircle, title: "Correção", description: "Corrigir dados incorretos ou incompletos" },
    { icon: Zap, title: "Portabilidade", description: "Receber seus dados em formato estruturado" },
    { icon: AlertTriangle, title: "Exclusão", description: "Solicitar a remoção de seus dados" },
  ]

  const securityFeatures = [
    { icon: Shield, text: "Criptografia SSL/TLS", color: "text-green-400" },
    { icon: Lock, text: "Acesso Restrito", color: "text-blue-400" },
    { icon: Database, text: "Backups Seguros", color: "text-purple-400" },
    { icon: Users, text: "Equipe Treinada", color: "text-orange-400" },
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
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Política de Privacidade</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Privacidade</span> é Prioridade
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Conheça como protegemos seus dados e garantimos total conformidade com a LGPD
            </p>

            {/* Security Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {securityFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <div className="text-sm text-gray-300 font-medium">{feature.text}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* LGPD Rights Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Seus <span className="text-primary">Direitos LGPD</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Conheça seus direitos garantidos pela Lei Geral de Proteção de Dados
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {lgpdRights.map((right, index) => {
                const Icon = right.icon
                return (
                  <Card 
                    key={right.title}
                    className="group relative overflow-hidden bg-black/20 border border-white/5 backdrop-blur-sm hover:bg-black/30 hover:border-primary/30 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
                  >
                    <CardContent className="p-8 text-center">
                      <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">{right.title}</h3>
                      <p className="text-gray-300 text-sm leading-relaxed">{right.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Nossa <span className="text-primary">Política</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transparência total sobre como tratamos e protegemos suas informações
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {privacySections.map((section, index) => {
                const Icon = section.icon
                return (
                  <Card 
                    key={section.title}
                    className="group relative overflow-hidden bg-black/20 border border-white/5 backdrop-blur-sm hover:bg-black/30 hover:border-primary/30 transition-all duration-500 cursor-pointer transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10"
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    <CardContent className="relative p-8">
                      {/* Header */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${section.color} w-16 h-16 flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{section.title}</h3>
                          <p className="text-gray-400 text-sm">Informações detalhadas</p>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4">
                        {section.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
                  <Info className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Dúvidas sobre <span className="text-primary">Privacidade?</span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Nossa equipe está disponível para esclarecer qualquer dúvida sobre o tratamento de seus dados pessoais
                </p>
                
                <div className="bg-black/20 rounded-xl p-6 border border-white/10 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Contato do DPO</h3>
                  <p className="text-gray-300">Email: dpo@cdforge.dev</p>
                  <p className="text-gray-300">Resposta em até 48 horas úteis</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contato" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Falar com Especialista
                  </a>
                  
                  <a 
                    href="/faq" 
                    className="inline-flex items-center justify-center px-8 py-4 border border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    <Info className="h-5 w-5 mr-2" />
                    Ver FAQ
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Last Update */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="bg-yellow-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">Última Atualização</h3>
                                 <p className="text-gray-300">Agosto de 2025</p>
                <p className="text-sm text-gray-400 mt-2">
                  Esta política é revisada regularmente para garantir conformidade com as leis vigentes
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
