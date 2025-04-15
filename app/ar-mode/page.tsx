"use client"

import { useState, Suspense } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Glasses, Check } from "lucide-react"
import { SimplifiedHeader } from "@/components/simplified-header"
import Link from "next/link"
import dynamic from "next/dynamic"
// Dynamically import components
const DynamicSparklesCore = dynamic(() => import("@/components/sparkles").then((mod) => mod.SparklesCore), {
  ssr: false,
  loading: () => <div className="h-full w-full absolute inset-0 z-0 bg-black/[0.96]"></div>,
})

// Loading component for content
const ContentLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
  </div>
)

export default function ARModePage() {
  const [enabled, setEnabled] = useState(false)
  const router = useRouter()

  const handleEnable = () => {
    setEnabled(true)
    // In a real app, this would trigger AR mode initialization
  }

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] flex flex-col relative overflow-x-hidden">
      {/* Interactive background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <DynamicSparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <SimplifiedHeader title="AR Mode" icon={<Glasses className="h-6 w-6" />} />

      <main className="flex-1 pt-16 relative z-10">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Suspense fallback={<ContentLoading />}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800/90 backdrop-blur-md rounded-xl p-8 border border-gray-700 glow-purple-sm"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-full md:w-1/2">
                  <h2 className="text-2xl font-bold text-white mb-4">Experience Augmented Reality Assistance</h2>
                  <p className="text-gray-300 mb-6">
                    AR Mode overlays helpful information in your field of view, allowing NbAIl to provide contextual
                    assistance in the real world.
                  </p>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-gray-300">Get real-time translations of text in your environment</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-gray-300">Identify objects and get information about them</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-gray-300">Receive step-by-step guidance for complex tasks</p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                        <Check className="h-4 w-4 text-purple-500" />
                      </div>
                      <p className="text-gray-300">See virtual annotations on physical objects</p>
                    </div>
                  </div>
                  <Button
                    className={`${
                      enabled
                        ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white"
                    }`}
                    onClick={handleEnable}
                    disabled={enabled}
                  >
                    {enabled ? "AR Mode Enabled" : "Enable AR Mode"}
                  </Button>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="relative">
                    <div className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 glow-purple-sm">
                      <img
                        src="/placeholder.svg?height=300&width=400"
                        alt="AR Mode Illustration"
                        className="w-full h-auto"
                      />
                    </div>
                    {enabled && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-purple-500/20 flex items-center justify-center rounded-lg"
                      >
                        <div className="bg-gray-900/80 backdrop-blur-sm p-4 rounded-lg border border-purple-500/50">
                          <p className="text-white font-medium">AR Mode Active</p>
                          <p className="text-gray-300 text-sm">Looking at your environment...</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 bg-gray-800/90 backdrop-blur-md rounded-xl p-8 border border-gray-700 glow-purple-sm"
            >
              <h3 className="text-xl font-bold text-white mb-4">How AR Mode Works</h3>
              <p className="text-gray-300 mb-6">
                AR Mode uses your device's camera to understand your environment and overlay helpful information. Here's
                how to get the most out of it:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Enable Permissions",
                    description: "Allow camera access when prompted to let NbAIl see your environment.",
                  },
                  {
                    title: "Point Your Camera",
                    description: "Aim your device at objects, text, or scenes you want information about.",
                  },
                  {
                    title: "Voice Commands",
                    description: "Use voice commands like 'What's this?' or 'Translate this' for quick actions.",
                  },
                ].map((step, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600 card-hover">
                    <div className="bg-purple-500/20 w-8 h-8 rounded-full flex items-center justify-center mb-3">
                      <span className="text-purple-500 font-medium">{index + 1}</span>
                    </div>
                    <h4 className="text-white font-medium mb-2">{step.title}</h4>
                    <p className="text-gray-300 text-sm">{step.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </Suspense>
        </div>
      </main>

      <footer className="border-t border-gray-800 glass py-6 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            AR Mode is currently in beta. We appreciate your feedback!
          </p>
          <div className="flex space-x-4">
            <Button
              variant="link"
              className="text-purple-500 hover:text-purple-400 text-sm font-medium"
              onClick={() => router.push("/chat")}
            >
              Return to Chat
            </Button>
            <Link href="/dashboard" className="text-purple-500 hover:text-purple-400 text-sm font-medium">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
