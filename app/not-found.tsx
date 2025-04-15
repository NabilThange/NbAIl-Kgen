import Link from "next/link"
import { Brain } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Brain className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white" asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" className="border-green-500 text-white hover:bg-green-500/20" asChild>
            <Link href="/chat">Try NbAIl</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
