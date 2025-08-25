import Image from "next/image"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "full" | "short"
}

export function Logo({ className = "", size = "md", variant = "full" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <Image
          src="/logo-blue.svg"
          alt="CodeForge Logo"
          width={543}
          height={567}
          className="w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-serif font-black text-blue-500 ${size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-3xl"}`}
        >
          {variant === "full" ? "CodeForge" : "CDforge"}
        </span>
        {variant === "full" && (
          <span className={`font-sans text-white/80 ${size === "sm" ? "text-xs" : "text-sm"}`}>Serviços Digitais</span>
        )}
      </div>
    </div>
  )
}
