import type { Metadata } from "next"
import { ContactForm } from "@/components/sections/contact-form"
import { TestimonialSingle } from "@/components/sections/testimonial-single"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with our team.",
}

export default function ContactPage() {
  return (
    <>
      <ContactForm />
      <TestimonialSingle />
    </>
  )
}
