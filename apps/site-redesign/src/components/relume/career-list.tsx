"use client"

import { MapPin } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
} from "@relume_io/relume-ui"

type Job = {
  title: string
  location: string
  type: string
  level: string
}

type Department = {
  name: string
  openings: number
  jobs: Job[]
}

const departments: Department[] = [
  {
    name: "Engineering",
    openings: 4,
    jobs: [
      { title: "Senior Frontend Engineer", location: "Remote", type: "Full-time", level: "Senior" },
      { title: "Backend Engineer", location: "San Francisco, CA", type: "Full-time", level: "Mid" },
      { title: "DevOps Engineer", location: "Remote", type: "Full-time", level: "Senior" },
      { title: "QA Engineer", location: "New York, NY", type: "Full-time", level: "Mid" },
    ],
  },
  {
    name: "Design",
    openings: 2,
    jobs: [
      { title: "Senior Product Designer", location: "Remote", type: "Full-time", level: "Senior" },
      { title: "Design Systems Engineer", location: "San Francisco, CA", type: "Full-time", level: "Mid" },
    ],
  },
  {
    name: "Marketing",
    openings: 3,
    jobs: [
      { title: "Content Marketing Manager", location: "Remote", type: "Full-time", level: "Mid" },
      { title: "Growth Lead", location: "New York, NY", type: "Full-time", level: "Senior" },
      { title: "Marketing Coordinator", location: "Remote", type: "Full-time", level: "Junior" },
    ],
  },
  {
    name: "Customer Success",
    openings: 2,
    jobs: [
      { title: "Customer Success Manager", location: "Remote", type: "Full-time", level: "Mid" },
      { title: "Technical Support Specialist", location: "Austin, TX", type: "Full-time", level: "Junior" },
    ],
  },
]

export function CareerList() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Join the team
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            We&apos;re building the future of SaaS infrastructure. Find your
            next role and help us shape what&apos;s next.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="multiple" defaultValue={["dept-0"]}>
            {departments.map((dept, di) => (
              <AccordionItem key={dept.name} value={`dept-${di}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold">
                      {dept.name}
                    </span>
                    <Badge variant="secondary">
                      {dept.openings} open
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pb-2">
                    {dept.jobs.map((job) => (
                      <div
                        key={job.title}
                        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {job.title}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="size-3" />
                              {job.location}
                            </span>
                            <span>&middot;</span>
                            <span>{job.type}</span>
                            <span>&middot;</span>
                            <Badge variant="outline">{job.level}</Badge>
                          </div>
                        </div>
                        <Button variant="secondary" size="sm">
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
