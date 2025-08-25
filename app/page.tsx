import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { ParticlesBackground } from "@/components/particles-background"

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground particleCount={40} />
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
