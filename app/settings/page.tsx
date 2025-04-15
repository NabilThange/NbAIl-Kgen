"use client"

import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, User, Bell, Shield, Moon, Sun, Globe } from "lucide-react"
import MinimalHeader from "@/components/minimal-header"
import dynamic from "next/dynamic"

// Dynamically import components
const DynamicSparklesCore = dynamic(() => import("@/components/sparkles").then((mod) => mod.SparklesCore), {
  ssr: false,
  loading: () => <div className="h-full w-full absolute inset-0 z-0 bg-black/[0.96]"></div>,
})

// Loading component for Suspense
const TabsLoading = () => (
  <div className="w-full flex justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
  </div>
)

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [language, setLanguage] = useState("english")
  const [voiceType, setVoiceType] = useState("default")
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-x-hidden">
      {/* Interactive background with moving particles */}
      <div className="h-full w-full absolute inset-0 z-0">
        <DynamicSparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={30}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <MinimalHeader title="Settings" />

      <main className="flex-1 pt-16 relative z-10">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <Suspense fallback={<TabsLoading />}>
            <Tabs defaultValue="account" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 overflow-x-auto">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <Card className="bg-gray-800/90 backdrop-blur-md border border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <User className="h-5 w-5 mr-2 text-purple-500" />
                        Profile Information
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Update your account information and profile settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-300">
                            Full Name
                          </Label>
                          <Input
                            id="name"
                            defaultValue="Alex Johnson"
                            className="bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-300">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            defaultValue="alex@example.com"
                            className="bg-gray-700 border-gray-600 text-white focus:border-purple-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray-300">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          defaultValue="AI researcher and tech enthusiast"
                          className="bg-gray-700 border-gray-600 text-white focus:border-purple-500 min-h-[100px]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button className="bg-purple-600 hover:bg-purple-700 text-white">Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-800/90 backdrop-blur-md border border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Bell className="h-5 w-5 mr-2 text-purple-500" />
                        Notification Settings
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage how you receive notifications and alerts
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Push Notifications</Label>
                          <p className="text-gray-400 text-sm">Receive notifications in the app</p>
                        </div>
                        <Switch
                          checked={notifications}
                          onCheckedChange={setNotifications}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Email Notifications</Label>
                          <p className="text-gray-400 text-sm">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="appearance">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gray-800/90 backdrop-blur-md border border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        {darkMode ? (
                          <Moon className="h-5 w-5 mr-2 text-purple-500" />
                        ) : (
                          <Sun className="h-5 w-5 mr-2 text-purple-500" />
                        )}
                        Appearance
                      </CardTitle>
                      <CardDescription className="text-gray-400">Customize how NbAIl looks and feels</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Dark Mode</Label>
                          <p className="text-gray-400 text-sm">Toggle between light and dark themes</p>
                        </div>
                        <Switch
                          checked={darkMode}
                          onCheckedChange={setDarkMode}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-gray-300">
                          Language
                        </Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-purple-500">
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="spanish">Spanish</SelectItem>
                            <SelectItem value="french">French</SelectItem>
                            <SelectItem value="german">German</SelectItem>
                            <SelectItem value="japanese">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="voice" className="text-gray-300">
                          Assistant Voice
                        </Label>
                        <Select value={voiceType} onValueChange={setVoiceType}>
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-purple-500">
                            <SelectValue placeholder="Select a voice" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="default">Default</SelectItem>
                            <SelectItem value="friendly">Friendly</SelectItem>
                            <SelectItem value="professional">Professional</SelectItem>
                            <SelectItem value="energetic">Energetic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4 border-t border-gray-700">
                        <h4 className="text-white font-medium mb-4 flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-purple-500" />
                          Regional Settings
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="timezone" className="text-gray-300">
                              Timezone
                            </Label>
                            <Select defaultValue="utc-8">
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-purple-500">
                                <SelectValue placeholder="Select timezone" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="utc-8">Pacific Time (UTC-8)</SelectItem>
                                <SelectItem value="utc-5">Eastern Time (UTC-5)</SelectItem>
                                <SelectItem value="utc+0">GMT (UTC+0)</SelectItem>
                                <SelectItem value="utc+1">Central European Time (UTC+1)</SelectItem>
                                <SelectItem value="utc+9">Japan Standard Time (UTC+9)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="dateformat" className="text-gray-300">
                              Date Format
                            </Label>
                            <Select defaultValue="mdy">
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-purple-500">
                                <SelectValue placeholder="Select date format" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                                <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                                <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="privacy">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gray-800/90 backdrop-blur-md border border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-purple-500" />
                        Privacy & Security
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage your privacy settings and security preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-white">Two-Factor Authentication</Label>
                          <p className="text-gray-400 text-sm">Add an extra layer of security to your account</p>
                        </div>
                        <Switch
                          checked={twoFactorAuth}
                          onCheckedChange={setTwoFactorAuth}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      </div>

                      <div className="space-y-4 pt-4 border-t border-gray-700">
                        <h4 className="text-white font-medium">Data Privacy</h4>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-white">Data Collection</Label>
                            <p className="text-gray-400 text-sm">
                              Allow NbAIl to collect usage data to improve services
                            </p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-purple-600" />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-white">Chat History</Label>
                            <p className="text-gray-400 text-sm">Store chat history for personalized responses</p>
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-purple-600" />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-700">
                        <h4 className="text-white font-medium mb-4">Account Security</h4>

                        <div className="space-y-4">
                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-700 w-full justify-start"
                          >
                            Change Password
                          </Button>

                          <Button
                            variant="outline"
                            className="border-gray-700 text-white hover:bg-gray-700 w-full justify-start"
                          >
                            Manage Connected Devices
                          </Button>

                          <Button
                            variant="outline"
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10 w-full justify-start"
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </Suspense>
        </div>
      </main>
    </div>
  )
}
