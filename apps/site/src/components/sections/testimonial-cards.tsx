import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "This tool cut our onboarding time in half. We went from weeks of setup to shipping in days. The team hasn't looked back since.",
    name: "Sarah Chen",
    initials: "SC",
    title: "Head of Product",
    company: "Streamline",
  },
  {
    quote:
      "We evaluated a dozen solutions before landing here. Nothing else came close in terms of developer experience and out-of-the-box functionality.",
    name: "Marcus Johnson",
    initials: "MJ",
    title: "CTO",
    company: "Vendora",
  },
  {
    quote:
      "Our conversion rate jumped 35% in the first month. The built-in analytics and A/B testing made it incredibly easy to iterate fast.",
    name: "Emily Rodriguez",
    initials: "ER",
    title: "Growth Lead",
    company: "BrightPath",
  },
];

function StarRating() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="size-4 fill-primary text-primary" />
      ))}
    </div>
  );
}

export function TestimonialCards() {
  return (
    <section className="px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What our customers say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Trusted by fast-growing teams who ship with confidence.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="bg-card">
              <CardContent className="flex flex-col gap-6">
                <StarRating />
                <p className="text-sm leading-relaxed text-foreground">
                  &ldquo;{testimonial.quote}&rdquo
                </p>
                <div className="flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage alt={testimonial.name} />
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
