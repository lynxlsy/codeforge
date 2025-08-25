"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, X, Home, Grid3X3, CreditCard, MessageCircle } from "lucide-react"
import { Logo } from "./logo"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Início", icon: Home },
    { href: "/categorias", label: "Categorias", icon: Grid3X3 },
    { href: "/planos", label: "Planos", icon: CreditCard },
    { href: "/contato", label: "Contato", icon: MessageCircle },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo size="sm" variant="full" />
          </Link>

          <div className="hidden md:flex md:items-center md:space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium",
                    active
                      ? "text-primary bg-primary/10 shadow-sm border border-primary/20"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {active && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200",
                    active
                      ? "text-primary bg-primary/10 border-l-2 border-primary"
                      : "text-foreground/80 hover:text-foreground hover:bg-accent",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {active && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse ml-auto" />}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
