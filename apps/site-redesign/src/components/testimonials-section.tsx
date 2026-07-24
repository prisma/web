import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    quote: "This product has completely transformed how our team works. We've saved hours every week.",
    name: "Alex Johnson",
    title: "CEO, TechCo",
    initials: "AJ",
  },
  {
    quote: "The best tool we've adopted this year. Simple to use and incredibly powerful.",
    name: "Sarah Chen",
    title: "Head of Product, StartupXYZ",
    initials: "SC",
  },
  {
    quote: "Outstanding support and a product that just works. Highly recommended for any team.",
    name: "Michael Park",
    title: "CTO, ScaleUp Inc",
    initials: "MP",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Loved by teams everywhere
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our customers have to say about their experience.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="pt-6">
                <p className="text-sm leading-relaxed mb-6">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
