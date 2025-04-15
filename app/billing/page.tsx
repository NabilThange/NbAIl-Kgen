"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, ArrowLeft, CreditCard, Receipt, Clock, CheckCircle, AlertCircle, ArrowUpRight } from "lucide-react"
import { SparklesCore } from "@/components/sparkles"

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState("pro")

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      description: "Basic features for personal use",
      features: ["Up to 100 messages per day", "Basic AR Mode", "Limited ScreenAware", "Standard response time"],
      cta: "Current Plan",
      disabled: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹1,499",
      period: "/month",
      description: "Advanced features for professionals",
      features: [
        "Unlimited messages",
        "Full AR Mode access",
        "Complete ScreenAware functionality",
        "Priority response time",
        "Custom voice options",
      ],
      cta: "Upgrade Now",
      popular: true,
    },
    {
      id: "team",
      name: "Team",
      price: "₹3,999",
      period: "/month",
      description: "Collaboration features for teams",
      features: [
        "Everything in Pro",
        "Up to 5 team members",
        "Shared chat history",
        "Team analytics",
        "Admin controls",
        "API access",
      ],
      cta: "Contact Sales",
    },
  ]

  const billingHistory = [
    {
      id: "INV-001",
      date: "Apr 1, 2023",
      amount: "₹1,499.00",
      status: "Paid",
      plan: "Pro Plan",
    },
    {
      id: "INV-002",
      date: "Mar 1, 2023",
      amount: "₹1,499.00",
      status: "Paid",
      plan: "Pro Plan",
    },
    {
      id: "INV-003",
      date: "Feb 1, 2023",
      amount: "₹1,499.00",
      status: "Paid",
      plan: "Pro Plan",
    },
  ]

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
            <Link href="/chat" className="text-gray-400 hover:text-white mr-4 flex items-center">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only md:not-sr-only md:inline-block md:ml-2">Back to Assistant</span>
            </Link>
            <div className="flex items-center">
              <CreditCard className="h-6 w-6 text-purple-500 mr-2" />
              <h1 className="text-white font-medium text-lg">Billing & Subscription</h1>
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
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Tabs defaultValue="subscription" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="billing-history">Billing History</TabsTrigger>
            </TabsList>

            <TabsContent value="subscription">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Your Plan</h2>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Select the plan that best fits your needs. All plans include core NbAIl features.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`bg-gray-800/90 backdrop-blur-md border ${
                        plan.popular ? "border-purple-500 shadow-lg shadow-purple-500/20" : "border-gray-700"
                      } relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/50`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-md">
                            POPULAR
                          </div>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-white flex items-baseline">
                          {plan.name}
                          <span className="ml-auto text-2xl font-bold">
                            {plan.price}
                            <span className="text-sm font-normal text-gray-400">{plan.period}</span>
                          </span>
                        </CardTitle>
                        <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-purple-500 mr-2 shrink-0" />
                              <span className="text-gray-300 text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className={`w-full ${
                            plan.id === "pro"
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "bg-gray-700 hover:bg-gray-600 text-white"
                          }`}
                          disabled={plan.disabled}
                          onClick={() => setSelectedPlan(plan.id)}
                        >
                          {plan.cta}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 bg-gray-800/90 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-6 w-6 text-purple-500 mr-2" />
                    <h3 className="text-xl font-bold text-white">Payment Method</h3>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg mb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-600 rounded-md p-2 mr-3">
                        <CreditCard className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">•••• •••• •••• 4242</p>
                        <p className="text-gray-400 text-sm">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                      Update
                    </Button>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center text-gray-400">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">Your next billing date is May 1, 2023</span>
                    </div>
                    <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                      Cancel Subscription
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="billing-history">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/90 backdrop-blur-md rounded-xl p-6 border border-gray-700"
              >
                <div className="flex items-center mb-6">
                  <Receipt className="h-6 w-6 text-purple-500 mr-2" />
                  <h3 className="text-xl font-bold text-white">Billing History</h3>
                </div>

                <div className="overflow-x-auto -mx-4 px-4">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Invoice</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Plan</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Amount</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                        <th className="text-right py-3 px-4 text-gray-400 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billingHistory.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="py-4 px-4 text-white">{invoice.id}</td>
                          <td className="py-4 px-4 text-gray-300">{invoice.date}</td>
                          <td className="py-4 px-4 text-gray-300">{invoice.plan}</td>
                          <td className="py-4 px-4 text-gray-300">{invoice.amount}</td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 flex justify-center">
                  <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-700">
                    <Clock className="h-4 w-4 mr-2" />
                    View Older Invoices
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
