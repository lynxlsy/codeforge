"use client"

import Link from "next/link"
import { useState } from "react"
import { Logo } from "./logo"
import { Separator } from "./ui/separator"
import { Code } from "lucide-react"
import { DevModalManager } from "./dev/dev-modal-manager"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [isDevModalOpen, setIsDevModalOpen] = useState(false)

  const footerLinks = {
    Serviços: [
      { href: "/categorias/bots", label: "Bots" },
      { href: "/categorias/sites", label: "Sites" },
      { href: "/categorias/personalizados", label: "Serviços Personalizados" },
    ],
    Empresa: [
      { href: "/sobre", label: "Sobre Nós" },
      { href: "/contato", label: "Contato" },
      { href: "/planos", label: "Planos" },
    ],
    Suporte: [
      { href: "/faq", label: "FAQ" },
      { href: "/termos", label: "Termos de Uso" },
      { href: "/privacidade", label: "Política de Privacidade" },
    ],
  }

  return (
    <>
      <footer className="bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <Logo size="md" variant="full" className="mb-4" />
              <p className="text-secondary-foreground/80 text-sm leading-relaxed">
                Especialistas em soluções digitais personalizadas. Transformamos suas ideias em realidade.
              </p>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-serif font-bold text-lg mb-4 text-secondary-foreground">{category}</h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-secondary-foreground/80 hover:text-secondary-foreground transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <Separator className="my-8 bg-secondary-foreground/20" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-secondary-foreground/80 text-sm">
              © 2024 CodeForge (CDforge). Todos os direitos reservados.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <button
                onClick={() => setIsDevModalOpen(true)}
                className="text-secondary-foreground/80 hover:text-accent transition-colors p-2 rounded-full hover:bg-secondary-foreground/10"
                title="Área DEV"
              >
                <Code className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* DEV Modal */}
      <DevModalManager 
        isOpen={isDevModalOpen} 
        onClose={() => setIsDevModalOpen(false)} 
      />
    </>
  )
}
