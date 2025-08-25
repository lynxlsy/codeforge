"use client"

import Link from "next/link"
import { ArrowRight, Bot, Globe, Zap } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function HeroSection() {
  const services = [
    {
      icon: Bot,
      title: "Bots Inteligentes",
      description: "Automação para Discord, Instagram e sistemas personalizados",
    },
    {
      icon: Globe,
      title: "Sites Profissionais",
      description: "Desenvolvimento web moderno e responsivo para seu negócio",
    },
    {
      icon: Zap,
      title: "Automações",
      description: "Soluções personalizadas para otimizar seus processos",
    },
  ]

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-background to-blue-400/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="mb-12 flex justify-center">
            <div className="relative group">
              <div className="relative">
                <div className="w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 flex items-center justify-center">
                  <div className="relative">
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-agyc4PJBa4QI0Ndum54jAq1NZJIcXp.png"
                      alt="CodeForge Logo"
                      className="relative z-10 w-32 h-32 md:w-44 md:h-44 lg:w-56 lg:h-56 hover:animate-spin-fast transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="font-serif font-black text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
            Transforme suas ideias em <span className="text-blue-400">soluções digitais</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 leading-relaxed">
            Na CodeForge, desenvolvemos bots, sites e automações personalizadas para impulsionar seu negócio no mundo
            digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="group relative text-lg px-12 py-6 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 hover:from-blue-500 hover:via-blue-600 hover:to-blue-500 text-black font-bold shadow-xl hover:shadow-2xl hover:shadow-blue-400/40 transform hover:scale-[1.02] transition-all duration-500 border border-blue-300/50 hover:border-blue-200 backdrop-blur-sm overflow-hidden"
            >
              <Link href="/categorias">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out"></div>
                <span className="relative z-10 flex items-center">
                  Explorar Serviços
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 bg-transparent border-blue-400/50 text-blue-400 hover:bg-blue-400/10 hover:border-blue-400 hover:text-blue-300 transition-all duration-300"
            >
              <Link href="/contato">Falar Conosco</Link>
            </Button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl hover:shadow-blue-400/20 transition-all duration-300 hover:-translate-y-1 bg-gray-900/50 border-gray-800 hover:border-blue-400/50"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-blue-400/20 w-fit group-hover:bg-blue-400/30 transition-colors">
                  <service.icon className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-xl font-serif font-bold text-white">{service.title}</CardTitle>
                <CardDescription className="text-base text-white/70">{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-serif font-black text-blue-400 mb-2">270+</div>
            <div className="text-white/70">Projetos Entregues</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-serif font-black text-blue-400 mb-2">24h</div>
            <div className="text-white/70">Resposta em até</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-serif font-black text-blue-400 mb-2">98%</div>
            <div className="text-white/70">Satisfação</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-serif font-black text-blue-400 mb-2">R$0+</div>
            <div className="text-white/70">A partir de</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-fast {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-fast {
          animation: spin-fast 0.6s ease-in-out;
        }
      `}</style>
    </section>
  )
}
