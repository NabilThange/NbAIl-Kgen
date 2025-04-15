"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"

export function FloatingPaper({ count = 5 }) {
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 })
  const [actualCount, setActualCount] = useState(count)

  useEffect(() => {
    // Update dimensions only on client side
    const updateDimensions = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setDimensions({ width, height })

      // Reduce paper count on smaller screens for better performance
      setActualCount(width < 768 ? Math.min(3, count) : count)
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [count])

  return (
    <div className="relative w-full h-full">
      {Array.from({ length: actualCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: Math.random() * dimensions.width,
            y: Math.random() * dimensions.height,
          }}
          animate={{
            x: [Math.random() * dimensions.width, Math.random() * dimensions.width, Math.random() * dimensions.width],
            y: [
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
              Math.random() * dimensions.height,
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="relative w-16 h-20 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 flex items-center justify-center transform hover:scale-110 transition-transform">
            <FileText className="w-8 h-8 text-purple-400/50" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
