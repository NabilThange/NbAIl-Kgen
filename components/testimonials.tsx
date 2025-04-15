"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rohan Sharma",
      role: "Software Engineer",
      content:
        "NbAIl has completely transformed my workflow. The screen awareness feature helps me debug code faster than ever before.",
      avatar: "/placeholder.svg?height=80&width=80",
      stars: 5,
    },
    {
      name: "Priya Iyer",
      role: "UX Designer",
      content:
        "As a designer, having an AI that can actually see and understand my work is game-changing. The feedback is surprisingly insightful.",
      avatar: "/placeholder.svg?height=80&width=80",
      stars: 5,
    },
    {
      name: "Ankit Verma",
      role: "Graduate Student",
      content:
        "I use NbAIl to help me understand research papers and organize my notes. It's like having a research assistant available 24/7.",
      avatar: "/placeholder.svg?height=80&width=80",
      stars: 4,
    },
  ]

  return (
    <section className="py-20 bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Discover how NbAIl is helping people across different fields enhance their productivity and creativity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700"
            >
              <div className="flex items-center mb-4">
                {Array.from({ length: testimonial.stars }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                ))}
                {Array.from({ length: 5 - testimonial.stars }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gray-600" />
                ))}
              </div>
              <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="h-10 w-10 rounded-full mr-3"
                />
                <div>
                  <h4 className="text-white font-medium">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
