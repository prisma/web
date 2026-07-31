import { Linkedin, Twitter } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type TeamMember = {
  name: string
  role: string
  bio: string
  initials: string
}

const team: TeamMember[] = [
  {
    name: "Alex Chen",
    role: "CEO & Co-founder",
    bio: "Former engineer at Stripe. Obsessed with developer experience and making complex things simple.",
    initials: "AC",
  },
  {
    name: "Sarah Kim",
    role: "CTO & Co-founder",
    bio: "Built infrastructure at scale for 10 years. Believes the best code is the code you never have to write.",
    initials: "SK",
  },
  {
    name: "Marcus Rivera",
    role: "Head of Design",
    bio: "Previously led design at two YC startups. Thinks every pixel should earn its place on the screen.",
    initials: "MR",
  },
  {
    name: "Priya Patel",
    role: "Head of Growth",
    bio: "Grew three B2B products from zero to profitability. Data-driven but trusts her gut when it matters.",
    initials: "PP",
  },
]

export function TeamGrid() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Meet the team
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A small, focused team that cares deeply about helping founders ship
            faster. We build the tools we wish we had.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center text-center">
              <Avatar className="size-24">
                <AvatarFallback className="text-lg">
                  {member.initials}
                </AvatarFallback>
              </Avatar>

              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-primary">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {member.bio}
              </p>

              <div className="mt-4 flex gap-3">
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`${member.name} on LinkedIn`}
                >
                  <Linkedin className="size-4" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`${member.name} on Twitter`}
                >
                  <Twitter className="size-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
