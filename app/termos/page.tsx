"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Sparkles,
  Shield,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Heart,
  Star,
} from "lucide-react"

export default function TermosPage() {
  const sections = [
    {
      title: "Aceitação dos Termos",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
      content: [
        "Ao acessar e usar os serviços da CodeForge, você concorda em cumprir e estar vinculado a estes Termos de Uso.",
        "Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.",
        "Reservamo-nos o direito de modificar estes termos a qualquer momento, notificando os usuários sobre mudanças significativas."
      ]
    },
    {
      title: "Uso dos Serviços",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      content: [
        "Nossos serviços são fornecidos para uso comercial e pessoal legítimo.",
        "Você concorda em não usar nossos serviços para atividades ilegais ou prejudiciais.",
        "É responsabilidade do cliente fornecer informações precisas e atualizadas.",
        "Reservamo-nos o direito de recusar serviço a qualquer pessoa por qualquer motivo."
      ]
    },
    {
      title: "Propriedade Intelectual",
      icon: Shield,
      color: "from-purple-500 to-pink-500",
      content: [
        "Todo o conteúdo, design e código desenvolvido pela CodeForge permanece nossa propriedade intelectual.",
        "O cliente recebe licença de uso para o projeto final entregue.",
        "Não é permitida a redistribuição ou revenda de nossos códigos e designs.",
        "Logos e marcas registradas permanecem propriedade de seus respectivos proprietários."
      ]
    },
    {
      title: "Pagamentos e Reembolsos",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      content: [
        "Todos os preços são em Reais (BRL) e incluem impostos aplicáveis.",
        "Pagamentos são processados de forma segura através de nossos parceiros.",
        "Reembolsos são avaliados caso a caso, conforme nossa política de satisfação.",
        "Projetos cancelados podem estar sujeitos a taxas de cancelamento."
      ]
    },
    {
      title: "Limitação de Responsabilidade",
      icon: AlertTriangle,
      color: "from-yellow-500 to-orange-500",
      content: [
        "A CodeForge não se responsabiliza por danos indiretos ou consequenciais.",
        "Nossa responsabilidade é limitada ao valor pago pelo serviço.",
        "Não garantimos disponibilidade 100% dos serviços, embora trabalhemos para isso.",
        "O cliente é responsável por manter backups de seus dados."
      ]
    },
    {
      title: "Privacidade e Segurança",
      icon: Info,
      color: "from-indigo-500 to-purple-500",
      content: [
        "Seguimos rigorosamente a LGPD (Lei Geral de Proteção de Dados).",
        "Seus dados são tratados com confidencialidade e segurança.",
        "Não compartilhamos informações pessoais com terceiros sem consentimento.",
        "Utilizamos criptografia e medidas de segurança avançadas."
      ]
    }
  ]

  const highlights = [
    { icon: Heart, text: "Compromisso com a Qualidade", color: "text-red-400" },
    { icon: Star, text: "Satisfação Garantida", color: "text-yellow-400" },
    { icon: Shield, text: "Segurança Total", color: "text-blue-400" },
    { icon: Users, text: "Suporte Dedicado", color: "text-green-400" },
  ]

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background via-background to-background/95">
      <ParticlesBackground particleCount={30} />
      <Navigation />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4">
          <div className="container mx-auto text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Termos de Uso</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Termos de <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Uso</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Conheça as regras e condições que regem o uso de nossos serviços
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`h-8 w-8 ${highlight.color}`} />
                    </div>
                    <div className="text-sm text-gray-300 font-medium">{highlight.text}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Nossos <span className="text-primary">Compromissos</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transparência e clareza em todas as nossas relações comerciais
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sections.map((section, index) => {
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
                          <p className="text-gray-400 text-sm">Informações importantes</p>
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

        {/* Important Notice */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <div className="bg-yellow-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
                  <AlertTriangle className="h-10 w-10 text-yellow-500" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Aviso <span className="text-yellow-500">Importante</span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Estes termos são atualizados regularmente. Recomendamos que você os revise periodicamente para se manter informado sobre nossas políticas e práticas.
                </p>
                
                <div className="bg-black/20 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Última Atualização</h3>
                  <p className="text-gray-300">Agosto de 2025</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border border-primary/20 backdrop-blur-sm">
              <CardContent className="p-16">
                <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
                  <Sparkles className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Dúvidas sobre os <span className="text-primary">Termos?</span>
                </h2>
                
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Nossa equipe jurídica está disponível para esclarecer qualquer dúvida sobre nossos termos de uso
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/contato" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <FileText className="h-5 w-5 mr-2" />
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
      </main>

      <Footer />
    </div>
  )
}
