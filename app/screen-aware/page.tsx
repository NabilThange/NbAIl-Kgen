"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Brain, Monitor, ArrowLeft, Check, Shield, ArrowUpRight } from "lucide-react"
import { SparklesCore } from "@/components/sparkles"

export default function ScreenAwarePage() {
  const [enabled, setEnabled] = useState(false)
  const router = useRouter()

  const handleEnable = () => {
    setEnabled(true)
    // In a real app, this would trigger screen awareness initialization
  }

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] flex flex-col relative overflow-x-hidden">
      {/* Interactive background with moving particles */}
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

      <header className="border-b border-gray-800 glass fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/chat" className="text-gray-400 hover:text-white mr-4 flex items-center">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only md:not-sr-only md:inline-block md:ml-2">Back to Assistant</span>
            </Link>
            <div className="flex items-center">
              <Monitor className="h-6 w-6 text-purple-500 mr-2" />
              <h1 className="text-white font-medium text-lg">ScreenAware</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
              <Link href="/chat">
                Go to Assistant
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-500" />
              <span className="text-white font-bold">NbAIl</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16 relative z-10">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/90 backdrop-blur-md rounded-xl p-8 border border-gray-700 glow-purple-sm"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-2xl font-bold text-white mb-4">Unlock Screen-Aware Assistance</h2>
                <p className="text-gray-300 mb-6">
                  ScreenAware allows NbAIl to see and understand what's on your screen, providing contextual assistance
                  for your digital activities.
                </p>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-gray-300">Get help with applications and websites you're using</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-gray-300">Receive contextual explanations for code, documents, and designs</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-gray-300">Automate repetitive tasks based on screen content</p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-500/20 rounded-full p-1 mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-purple-500" />
                    </div>
                    <p className="text-gray-300">Track your digital activities for productivity insights</p>
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
                  {enabled ? "ScreenAware Enabled" : "Enable ScreenAware"}
                </Button>
              </div>
              <div className="w-full md:w-1/2">
                <div className="relative">
                  <div className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 glow-purple-sm">
                    <img
                      src="/placeholder.svg?height=300&width=400"
                      alt="ScreenAware Illustration"
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
                        <p className="text-white font-medium">ScreenAware Active</p>
                        <p className="text-gray-300 text-sm">Analyzing your screen...</p>
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
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-purple-500 mr-2" />
              <h3 className="text-xl font-bold text-white">Privacy & Security</h3>
            </div>
            <p className="text-gray-300 mb-6">
              We take your privacy seriously. Here's how we protect your data when using ScreenAware:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Local Processing",
                  description: "Most screen analysis happens locally on your device, minimizing data transfer.",
                },
                {
                  title: "Selective Sharing",
                  description: "You control which parts of your screen are shared with NbAIl.",
                },
                {
                  title: "No Persistent Storage",
                  description: "Screen data is processed in real-time and not stored permanently.",
                },
                {
                  title: "Sensitive Data Protection",
                  description: "Automatic detection and blurring of sensitive information like passwords.",
                },
              ].map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600 card-hover">
                  <h4 className="text-white font-medium mb-2">{item.title}</h4>
                  <p className="text-gray-300 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="border-t border-gray-800 glass py-6 relative z-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            ScreenAware is currently in beta. We appreciate your feedback!
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
