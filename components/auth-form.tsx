/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface AuthFormProps {
  initialMode?: "login" | "signup"
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup")
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Ensure the checkbox reflects the initialMode prop
  useEffect(() => {
    setIsSignUp(initialMode === "signup")
  }, [initialMode])

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Login attempt:", { email: loginEmail, password: loginPassword })
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      router.push("/chat")
    }, 1500)
  }

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    console.log("Signup attempt:", { name: signupName, email: signupEmail, password: signupPassword })
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to chat page after simulated signup
      router.push("/chat")
    }, 1500)
  }

  return (
    <div className="wrapper flex justify-center pt-[200px]"> {/* Added flex/justify-center and padding-top */} 
      <div className="card-switch">
        <label className="switch">
          <input
            className="toggle"
            type="checkbox"
            checked={isSignUp}
            onChange={() => setIsSignUp(!isSignUp)}
          />
          <span className="slider"></span>
          <span className="card-side"></span>
          <div className="flip-card__inner">
            <div className="flip-card__front">
              <div className="title">Log in</div>
              <form onSubmit={handleLoginSubmit} className="flip-card__form">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="flip-card__input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="flip-card__input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button className="flip-card__btn" type="submit" disabled={isLoading}>
                  {isLoading && !isSignUp ? "Loading..." : "Let`s go!"}
                </button>
              </form>
            </div>
            <div className="flip-card__back">
              <div className="title">Sign up</div>
              <form onSubmit={handleSignupSubmit} className="flip-card__form">
                <input
                  type="text" // Changed type to text for name
                  placeholder="Name"
                  name="name" // Added name attribute
                  className="flip-card__input"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  className="flip-card__input"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  className="flip-card__input"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <button className="flip-card__btn" type="submit" disabled={isLoading}>
                  {isLoading && isSignUp ? "Loading..." : "Confirm!"}
                </button>
              </form>
            </div>
          </div>
        </label>
      </div>
    </div>
  )
} 