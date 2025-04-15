"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Glasses, Monitor, ArrowUpRight, Settings, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SparklesCore } from "@/components/sparkles"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-x-hidden">
      {/* Interactive background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={50} // Reduced density for better performance
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <div className="p-6 md:p-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome to NbAIl! Here's an overview of your account.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
              <Link href="/chat">
                Go to Assistant
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-700" asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-700" asChild>
              <Link href="/billing">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-800/50 backdrop-blur-sm p-1 rounded-lg w-fit">
          <Button
            variant={activeTab === "overview" ? "default" : "ghost"}
            className={activeTab === "overview" ? "bg-purple-600" : "text-gray-400"}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === "analytics" ? "default" : "ghost"}
            className={activeTab === "analytics" ? "bg-purple-600" : "text-gray-400"}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </Button>
          <Button
            variant={activeTab === "insights" ? "default" : "ghost"}
            className={activeTab === "insights" ? "bg-purple-600" : "text-gray-400"}
            onClick={() => setActiveTab("insights")}
          >
            Insights
          </Button>
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">Welcome to NbAIl</CardTitle>
              <CardDescription className="text-gray-400">
                Your AI assistant is ready to help you with various tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                NbAIl is a multimodal AI assistant designed to understand text, voice, and screen in real-time. Start a
                conversation to experience the power of AI.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link href="/chat">Start Chatting</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-white mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Chat</CardTitle>
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Interact with NbAIl through natural language conversations</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">AR Mode</CardTitle>
                <Glasses className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Experience augmented reality assistance in your environment</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">ScreenAware</CardTitle>
                <Monitor className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Let NbAIl see and understand what's on your screen</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
