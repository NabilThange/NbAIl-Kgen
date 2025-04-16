"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Brain, ArrowLeft, HelpCircle, Search, MessageSquare, Glasses, Monitor, Book, Video, Mail } from "lucide-react"
import { SparklesCore } from "@/components/sparkles"
import Image from "next/image"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      question: "What is NbAIl?",
      answer:
        "NbAIl is a multimodal AI assistant designed to understand text, voice, and screen in real-time. It's built for creators, researchers, and everyday users to provide intelligent assistance across various tasks and contexts.",
    },
    {
      question: "How does AR Mode work?",
      answer:
        "AR Mode uses your device's camera to understand your environment and overlay helpful information in your field of view. This allows NbAIl to provide contextual assistance in the real world, such as translating text, identifying objects, and providing step-by-step guidance for complex tasks.",
    },
    {
      question: "What is ScreenAware mode?",
      answer:
        "ScreenAware allows NbAIl to see and understand what's on your screen, providing contextual assistance for your digital activities. It can help with applications and websites you're using, explain code or documents, and even automate repetitive tasks based on screen content.",
    },
    {
      question: "Is my data secure with NbAIl?",
      answer:
        "Yes, we take your privacy seriously. Most screen analysis happens locally on your device, minimizing data transfer. You control which parts of your screen are shared, and sensitive information is automatically detected and blurred. We do not store screen data permanently.",
    },
    {
      question: "What subscription plans are available?",
      answer:
        "NbAIl offers three subscription tiers: Free (basic features for personal use), Pro ($19/month for advanced features and unlimited usage), and Team ($49/month for collaboration features and team management). You can view detailed plan information on our Billing page.",
    },
    {
      question: "Can I use NbAIl offline?",
      answer:
        "Some basic features of NbAIl can work offline, but most advanced features require an internet connection to access our AI models and provide the best assistance. We're working on expanding offline capabilities in future updates.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription at any time from the Billing page. Go to Settings > Billing, and click on 'Cancel Subscription'. Your access will continue until the end of your current billing period.",
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Yes, NbAIl is available on iOS and Android devices. You can download the app from the App Store or Google Play Store to access all features on the go, including AR Mode which works best on mobile devices.",
    },
  ]

  const tutorials = [
    {
      title: "Getting Started with NbAIl",
      description: "Learn the basics of using NbAIl for your daily tasks",
      icon: <Book className="h-5 w-5 text-purple-500" />,
      time: "5 min read",
    },
    {
      title: "Mastering AR Mode",
      description: "Discover how to use AR Mode effectively in different scenarios",
      icon: <Glasses className="h-5 w-5 text-purple-500" />,
      time: "8 min read",
    },
    {
      title: "ScreenAware for Productivity",
      description: "Learn how ScreenAware can boost your productivity",
      icon: <Monitor className="h-5 w-5 text-purple-500" />,
      time: "6 min read",
    },
    {
      title: "Advanced Chat Techniques",
      description: "Get the most out of NbAIl's chat capabilities",
      icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
      time: "7 min read",
    },
  ]

  const videos = [
    {
      title: "NbAIl Quick Tour",
      description: "A quick overview of all NbAIl features",
      duration: "3:45",
    },
    {
      title: "AR Mode Tutorial",
      description: "How to use AR Mode in real-world scenarios",
      duration: "5:20",
    },
    {
      title: "ScreenAware for Developers",
      description: "Using ScreenAware for coding and development",
      duration: "7:15",
    },
    {
      title: "Voice Commands Guide",
      description: "Master all voice commands in NbAIl",
      duration: "4:30",
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-x-hidden">
      {/* Interactive background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={30}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <header className="border-b border-gray-800 glass fixed top-0 left-0 right-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/chat" className="text-gray-400 hover:text-white mr-4">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only md:not-sr-only md:inline-block md:ml-2">Back to Assistant</span>
            </Link>
            <div className="flex items-center">
              <HelpCircle className="h-6 w-6 text-purple-500 mr-2" />
              <h1 className="text-white font-medium text-lg">Help & Support</h1>
            </div>
          </div>
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <span className="text-white font-bold">NbAIl</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-16 relative z-10">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">How can we help you?</h2>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-6 bg-gray-800/80 border-gray-700 text-white focus:border-purple-500 rounded-full"
              />
            </div>
          </div>

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            <TabsContent value="faq">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="bg-gray-800/90 backdrop-blur-md border border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-purple-500" />
                      Frequently Asked Questions
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Find answers to common questions about NbAIl
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                          <AccordionItem key={index} value={`item-${index}`} className="border-gray-700">
                            <AccordionTrigger className="text-white hover:text-purple-400">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-300">{faq.answer}</AccordionContent>
                          </AccordionItem>
                        ))
                      ) : (
                        <div className="py-8 text-center">
                          <p className="text-gray-400">No results found for "{searchQuery}"</p>
                          <Button
                            variant="link"
                            className="text-purple-400 hover:text-purple-300 mt-2"
                            onClick={() => setSearchQuery("")}
                          >
                            Clear search
                          </Button>
                        </div>
                      )}
                    </Accordion>
                  </CardContent>
                </Card>

                <div className="mt-8 bg-gray-800/90 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
                    <p className="text-gray-400 mb-6">Our support team is ready to assist you</p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="tutorials">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tutorials.map((tutorial, index) => (
                    <Card
                      key={index}
                      className="bg-gray-800/90 backdrop-blur-md border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                          <div className="flex items-center">
                            {tutorial.icon}
                            <span className="ml-2">{tutorial.title}</span>
                          </div>
                          <span className="text-xs text-gray-400 font-normal">{tutorial.time}</span>
                        </CardTitle>
                        <CardDescription className="text-gray-400">{tutorial.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">Read Tutorial</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-700">
                    <Book className="h-4 w-4 mr-2" />
                    View All Tutorials
                  </Button>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="videos">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videos.map((video, index) => (
                    <div
                      key={index}
                      className="bg-gray-800/90 backdrop-blur-md rounded-xl border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                    >
                      <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
                        <Image
                          src={`/placeholder.svg`}
                          alt={video.title}
                          fill={true}
                          className="w-full h-full object-cover opacity-70"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-14 w-14 rounded-full bg-purple-600/90 flex items-center justify-center cursor-pointer hover:bg-purple-500 transition-colors">
                            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[16px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-white font-medium mb-1">{video.title}</h3>
                        <p className="text-gray-400 text-sm">{video.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-700">
                    <Video className="h-4 w-4 mr-2" />
                    View All Videos
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
