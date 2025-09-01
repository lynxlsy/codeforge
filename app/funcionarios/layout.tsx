import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "CDforge - Área do Funcionário",
  description: "Área administrativa para funcionários da CDforge",
}

export default function FuncionariosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
