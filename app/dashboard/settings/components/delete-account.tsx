"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"

export function DeleteAccount() {
  const [isLoading, setIsLoading] = useState(false)
  const [confirmText, setConfirmText] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (confirmText !== "delete my account") return

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all of your data. This action cannot be undone.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
            <p>
              This will permanently delete your account, all of your conversations, settings, and personal data. This
              action cannot be reversed, so please continue with caution.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">
              Type <span className="font-medium">delete my account</span> to confirm
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="border-red-500/50 focus:border-red-500"
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading || confirmText !== "delete my account"}
            className="ml-auto"
          >
            {isLoading ? "Deleting..." : "Delete account"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
