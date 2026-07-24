"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LeadMagnetForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isValid = name.trim() !== "" && isValidEmail

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isValid) {
      router.push("/lead-magnet/thank-you")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={!isValid}>
        Get Free Access
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  )
}
