"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface AuthFormProps {
  initialState?: "login" | "signup"
}

export default function AuthForm({ initialState = "login" }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(initialState === "signup")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = () => {
    setIsSignUp(!isSignUp)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const action = isSignUp ? "Sign Up" : "Log In"
    console.log(`${action} attempt with:`, { name: isSignUp ? name : undefined, email, password })

    // Simulate API call
    setTimeout(() => {
      console.log(`${action} successful (simulated)`)
      setIsLoading(false)
      // Redirect to chat after successful login/signup
      router.push("/chat")
    }, 1500)
  }

  return (
    <div className="auth-form-wrapper">
      <div className="card-switch">
        <label className="auth-switch">
          <input
            className="auth-toggle"
            type="checkbox"
            checked={isSignUp}
            onChange={handleToggle}
          />
          <span className="auth-slider"></span>
          <span className="auth-card-side"></span>
          <div className="auth-flip-card__inner">
            {/* Login Form */}
            <div className="auth-flip-card__front">
              <div className="auth-title">Log in</div>
              <form onSubmit={handleSubmit} className="auth-flip-card__form">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="auth-flip-card__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="auth-flip-card__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button className="auth-flip-card__btn" type="submit" disabled={isLoading}>
                  {isLoading && !isSignUp ? "Logging in..." : "Let's go!"}
                </button>
              </form>
            </div>
            {/* Sign Up Form */}
            <div className="auth-flip-card__back">
              <div className="auth-title">Sign up</div>
              <form onSubmit={handleSubmit} className="auth-flip-card__form">
                <input
                  type="text" // Changed from 'name' which is not a valid type
                  placeholder="Name"
                  name="name" // Keep name attribute for potential server use
                  className="auth-flip-card__input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="auth-flip-card__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="auth-flip-card__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button className="auth-flip-card__btn" type="submit" disabled={isLoading}>
                  {isLoading && isSignUp ? "Signing up..." : "Confirm!"}
                </button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  )
} 