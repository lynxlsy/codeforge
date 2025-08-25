import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CategoriesHero } from "@/components/categories/categories-hero"
import { CategoriesGrid } from "@/components/categories/categories-grid"
import { ParticlesBackground } from "@/components/particles-background"

export default function CategoriasPage() {
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground particleCount={25} />
      <Navigation />
      <main>
        <CategoriesHero />
        <CategoriesGrid />
      </main>
      <Footer />
    </div>
  )
}
