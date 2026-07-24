"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DemoForm() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [teamSize, setTeamSize] = useState("")
  const [role, setRole] = useState("")

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isStep1Valid = name.trim() !== "" && isValidEmail && company.trim() !== ""
  const isStep2Valid = teamSize !== "" && role !== ""

  return (
    <>
      <div className="flex justify-center gap-2 mb-10">
        {[1, 2, 3].map((dot) => (
          <div
            key={dot}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              dot === step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isStep1Valid) setStep(2)
          }}
          className="space-y-6"
        >
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
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Acme Inc."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={!isStep1Valid}>
              Next
            </Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (isStep2Valid) setStep(3)
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label>Team Size</Label>
            <Select value={teamSize} onValueChange={setTeamSize}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">1-5</SelectItem>
                <SelectItem value="6-20">6-20</SelectItem>
                <SelectItem value="21-50">21-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="200+">200+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="founder">Founder</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="submit" disabled={!isStep2Valid}>
              Next
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="size-16 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold">
            You&apos;re all set!
          </h2>
          <p className="text-muted-foreground">
            Thanks, {name}. We&apos;ll be in touch at {email} shortly.
          </p>
          <Button size="lg" className="rounded-full px-8">
            Schedule a call
          </Button>
        </div>
      )}
    </>
  )
}
