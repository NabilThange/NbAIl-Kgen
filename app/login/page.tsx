"use client"

import Link from "next/link"
import { Brain } from "lucide-react"
import { SparklesCore } from "@/components/sparkles"
import AuthForm from "@/components/auth-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      {/* Interactive background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <Link href="/" className="absolute top-8 left-8 flex items-center space-x-2 z-10">
        <Brain className="h-8 w-8 text-purple-500" />
        <span className="text-white font-bold text-xl">NbAIl</span>
      </Link>

      <AuthForm initialMode="login" />
    </div>
  )
}
