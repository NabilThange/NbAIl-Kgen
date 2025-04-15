"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Brain,
  LayoutDashboard,
  MessageSquare,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  User,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Chat",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Billing",
      href: "/dashboard/billing",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      name: "Help",
      href: "/dashboard/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ]

  return (
    <motion.div
      className={`bg-gray-900 border-r border-gray-800 h-screen flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-800">
        <Link href="/" className="flex items-center">
          <Brain className="h-8 w-8 text-green-500" />
          {!collapsed && <span className="text-white font-bold text-xl ml-2">NbAIl</span>}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <div className={isActive ? "text-green-500" : ""}>{item.icon}</div>
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <Link
          href="/logout"
          className={`flex items-center px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Logout</span>}
        </Link>
      </div>
    </motion.div>
  )
}
