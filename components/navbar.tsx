"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Update the mobile menu button to animate between menu and X
  const MenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
    return (
      <Button variant="ghost" size="icon" onClick={onClick} className="relative h-10 w-10 z-50">
        <span
          className={`absolute block h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out ${
            isOpen ? "rotate-45 translate-y-0" : "-translate-y-1.5"
          }`}
        />
        <span
          className={`absolute block h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`absolute block h-0.5 w-5 bg-white transform transition-all duration-300 ease-in-out ${
            isOpen ? "-rotate-45 translate-y-0" : "translate-y-1.5"
          }`}
        />
      </Button>
    )
  }

  return (
    <>
      {/* Blurred overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 shadow-lg z-40 md:hidden"
            >
              <div className="flex justify-end p-4">
                <MenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
              </div>
              <div className="px-4 pt-2 pb-6 space-y-1">
                <MobileNavLink href="/features">Features</MobileNavLink>
                <MobileNavLink href="/pricing">Pricing</MobileNavLink>
                <MobileNavLink href="/research">Research</MobileNavLink>
                <MobileNavLink href="/use-cases">Use Cases</MobileNavLink>
                <div className="pt-4 flex flex-col space-y-2">
                  <Button variant="outline" className="w-full justify-center" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button className="w-full justify-center bg-purple-600 hover:bg-purple-700" asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className={`fixed top-0 mt-2 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-gray-900/90 backdrop-blur-md shadow-md" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-purple-500" />
              <span className="text-white font-bold text-xl">NbAIl</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/features">Features</NavLink>
              <NavLink href="/pricing">Pricing</NavLink>
              <NavLink href="/research">Research</NavLink>
              <NavLink href="/use-cases">Use Cases</NavLink>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <MenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`text-sm font-medium relative group overflow-hidden ${isActive ? "text-white" : "text-gray-300"}`}
    >
      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{children}</span>
      {isActive ? (
        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-purple-500 rounded-full" />
      ) : (
        <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-purple-500 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0" />
      )}
    </Link>
  )
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={`block py-2 px-3 rounded-md text-base font-medium ${
        isActive ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {children}
    </Link>
  )
}
