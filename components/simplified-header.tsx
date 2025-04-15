import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"

interface SimplifiedHeaderProps {
  title: string
  icon?: React.ReactNode
}

export function SimplifiedHeader({ title, icon }: SimplifiedHeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex items-center">
          {icon && <div className="mr-2 text-purple-500">{icon}</div>}
          <h1 className="text-white font-medium text-lg">{title}</h1>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
          <Link href="/chat">
            Go to Chat
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
