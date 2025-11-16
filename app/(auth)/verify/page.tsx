"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Invalid verification link")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        })

        const result = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(result.message)
        } else {
          setStatus("error")
          setMessage(result.error || "Verification failed")
        }
      } catch {
        setStatus("error")
        setMessage("An unexpected error occurred")
      }
    }

    verifyEmail()
  }, [token])

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          {status === "loading" && (
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          )}
          {status === "success" && (
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          )}
          {status === "error" && (
            <div className="rounded-full bg-red-100 p-3">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          )}
        </div>
        <CardTitle className="text-2xl font-bold text-center">
          {status === "loading" && "Verifying your email..."}
          {status === "success" && "Email Verified!"}
          {status === "error" && "Verification Failed"}
        </CardTitle>
        <CardDescription className="text-center">{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {status === "success" && (
          <p className="text-sm text-muted-foreground">
            Your account is now active. You can start creating forms!
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-muted-foreground">
            The verification link may have expired or already been used.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        {status !== "loading" && (
          <Button asChild>
            <Link href="/login">
              {status === "success" ? "Continue to Login" : "Back to Login"}
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
