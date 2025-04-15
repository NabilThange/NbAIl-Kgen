"use client"

import { motion } from "framer-motion"
import { Mic, Monitor, FileText, Glasses, Brain, History } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: <Mic className="h-10 w-10 text-purple-500" />,
      title: "Voice Interaction",
      description: "Talk naturally with NbAIl using advanced speech recognition and natural language processing.",
    },
    {
      icon: <Monitor className="h-10 w-10 text-purple-500" />,
      title: "Screen Awareness",
      description: "NbAIl can see and understand what's on your screen to provide contextual assistance.",
    },
    {
      icon: <FileText className="h-10 w-10 text-purple-500" />,
      title: "Document Understanding",
      description: "Upload and analyze documents, images, and files for instant insights and summaries.",
    },
    {
      icon: <Glasses className="h-10 w-10 text-purple-500" />,
      title: "AR Mode",
      description: "Experience augmented reality assistance that overlays helpful information in your field of view.",
    },
    {
      icon: <Brain className="h-10 w-10 text-purple-500" />,
      title: "Multimodal Intelligence",
      description: "Combines text, vision, voice, and context for a truly integrated AI experience.",
    },
    {
      icon: <History className="h-10 w-10 text-purple-500" />,
      title: "Chat Memory",
      description: "NbAIl remembers your conversations and builds context over time for more personalized help.",
    },
  ]

  return (
    <section id="features" className="py-20 bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            NbAIl combines multiple AI capabilities to create a truly intelligent assistant that understands your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="bg-gray-900 rounded-lg w-16 h-16 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
