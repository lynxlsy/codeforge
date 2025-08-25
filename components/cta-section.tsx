import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "./ui/button"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif font-black text-3xl md:text-5xl text-primary-foreground mb-6">
            Pronto para começar seu projeto?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Entre em contato conosco e descubra como podemos transformar suas ideias em realidade digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link href="/categorias">
                Ver Categorias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/contato">
                <MessageCircle className="mr-2 h-5 w-5" />
                Falar Conosco
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
