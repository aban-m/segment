"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useState } from "react"

export function SignInButton({ size, ...props }: ButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      size={size}
      className="bg-blue-600 hover:bg-blue-700"
      {...props}
    >
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  )
}
