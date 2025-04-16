import dynamic from "next/dynamic"
import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
// import Features from "@/components/features-section"
// import Footer from "@/components/footer"
// import UseCases from "@/components/use-cases-section"
// import Testimonials from "@/components/testimonials"
// import CTA from "@/components/cta"
import { SparklesCore } from "@/components/sparkles"

// Lazy load components below the fold
const Features = dynamic(() => import("@/components/features-section"))
const UseCases = dynamic(() => import("@/components/use-cases-section"))
const Testimonials = dynamic(() => import("@/components/testimonials"))
const CTA = dynamic(() => import("@/components/cta"))
const Footer = dynamic(() => import("@/components/footer"))

export default function Home() {
  return (
    <main className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Interactive background with moving particles - from Version 1 */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Features />
        <UseCases />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
