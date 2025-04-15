"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Brain, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

interface ParticleStyle {
  width: number
  height: number
  left: string
  top: string
  duration: number
  delay: number
}

export default function Hero() {
  const [particleStyles, setParticleStyles] = useState<ParticleStyle[]>([])

  useEffect(() => {
    const styles = Array.from({ length: 20 }).map(() => ({
      width: Math.random() * 40 + 10,
      height: Math.random() * 40 + 10,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }))
    setParticleStyles(styles)
  }, []) // Empty dependency array ensures this runs only once on mount

  return (
    <div className="relative pt-36 pb-32 md:pt-52 md:pb-44">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 to-transparent" />

      {/* Animated particles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {particleStyles.map((style, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-purple-500/20"
              style={{
                width: style.width,
                height: style.height,
                left: style.left,
                top: style.top,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: style.duration,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: style.delay,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm p-2 rounded-full inline-flex items-center">
              <motion.div
                className="bg-purple-500/20 p-1 rounded-full"
                animate={{
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    "0 0 0 0 rgba(168, 85, 247, 0.4)",
                    "0 0 0 4px rgba(168, 85, 247, 0.2)",
                    "0 0 0 0 rgba(168, 85, 247, 0.4)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-5 w-5 text-purple-500" />
              </motion.div>
              <span className="ml-2 mr-3 text-sm font-medium text-gray-300">Introducing NbAIl - Now with AR Mode</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
          >
            Meet NbAIl — Your Multimodal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
              AI Assistant
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto"
          >
            Designed to understand text, voice, and screen in real-time. Built for creators, researchers, and everyday
            users.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8" asChild>
              <Link href="/chat">
                Try NbAIl
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-purple-500 hover:bg-purple-500/20" asChild>
              <Link href="#features">
                Learn More
                <Brain className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 relative max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-b from-purple-500/20 to-pink-500/20 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <div className="relative bg-gray-900 rounded-t-xl p-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>
            {/* Replace with placeholder.svg */}
            <div className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-gray-900 flex items-center justify-center">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="NbAIl AI Assistant"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-xl opacity-20 -z-10" />
        </motion.div>
      </div>
    </div>
  )
}
