import { CheckCircle, Clock, Shield, Users } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"

export function FeaturesSection() {
  const features = [
    {
      icon: CheckCircle,
      title: "Qualidade Garantida",
      description: "Código limpo, documentado e testado para máxima confiabilidade",
    },
    {
      icon: Clock,
      title: "Entrega Rápida",
      description: "Prazos otimizados sem comprometer a qualidade do projeto",
    },
    {
      icon: Shield,
      title: "Segurança Total",
      description: "Implementação de melhores práticas de segurança digital",
    },
    {
      icon: Users,
      title: "Suporte Dedicado",
      description: "Acompanhamento completo durante e após o desenvolvimento",
    },
  ]

  return (
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
          {features.map((feature, index) => (
            <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-serif font-bold">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
