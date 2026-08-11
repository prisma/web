"use client"

import { useEffect, useState } from "react"
import { ArrowRight } from "@/components/icons/forma"

// Open roles, fetched client-side from the Rippling ATS board — same source
// as the old site's careers page. Needs NEXT_PUBLIC_BOARD_ID at build time;
// without it (e.g. local dev) the section degrades to a quiet empty state.

type Job = {
  id?: string
  name: string
  url: string
  dept: string
  location?: string
}

type JobsByDept = Record<string, Job[]>

const BOARD_ID = process.env.NEXT_PUBLIC_BOARD_ID

export function OpenRoles() {
  const [jobs, setJobs] = useState<JobsByDept | null>(null)

  useEffect(() => {
    if (!BOARD_ID) {
      setJobs({})
      return
    }
    fetch(`https://api.rippling.com/platform/api/ats/v1/board/${BOARD_ID}/jobs`)
      .then((res) => res.json())
      .then((data: Array<{ id?: string; name: string; url: string; department: { label: string }; workLocation?: { label: string } }>) => {
        const seen = new Set<string>()
        const grouped: JobsByDept = {}
        const sorted = [...data].sort((a, b) => {
          const aGeneral = a.name.includes("General Applications")
          const bGeneral = b.name.includes("General Applications")
          if (aGeneral !== bGeneral) return aGeneral ? 1 : -1
          return a.name.localeCompare(b.name)
        })
        for (const job of sorted) {
          if (seen.has(job.url)) continue
          seen.add(job.url)
          const dept = job.department.label
          grouped[dept] ??= []
          grouped[dept].push({
            id: job.id,
            name: job.name,
            url: job.url,
            dept,
            location: job.workLocation?.label.split(" (")[0],
          })
        }
        setJobs(grouped)
      })
      .catch(() => setJobs({}))
  }, [])

  const depts = jobs ? Object.keys(jobs) : []

  return (
    <section id="open-positions" className="scroll-m-24 bg-white px-4 pb-24 sm:px-8 sm:pb-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="mx-auto max-w-[24ch] text-balance text-center text-[clamp(1.75rem,2.75vw,2.375rem)] leading-[1.1]">
          Open roles
        </h2>

        {jobs === null && (
          <p className="mt-12 text-center text-sm text-muted-foreground">Loading roles…</p>
        )}

        {jobs !== null && depts.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            No open roles listed right now — check back soon.
          </p>
        )}

        <div className="mt-12 flex flex-col gap-10">
          {depts.map((dept) => (
            <div key={dept}>
              <p className="mb-3 text-sm font-semibold text-foreground/70">{dept}</p>
              <ul className="flex flex-col gap-2.5">
                {jobs?.[dept].map((job) => (
                  <li key={job.id ?? job.url}>
                    <a
                      href={job.url}
                      className="group flex flex-col justify-between gap-2 rounded-2xl border border-black/[0.06] bg-white p-5 shadow-[0_1px_2px_rgba(21,21,21,0.04)] transition-[border-color,box-shadow] duration-300 hover:border-black/[0.12] hover:shadow-[0_6px_20px_rgba(21,21,21,0.07)] sm:flex-row sm:items-center sm:px-6"
                    >
                      <span className="min-w-0">
                        {job.location && (
                          <span className="block text-sm text-muted-foreground">{job.location}</span>
                        )}
                        <span className="block font-semibold text-foreground">{job.name}</span>
                      </span>
                      <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground">
                        View job listing
                        <ArrowRight
                          className="size-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                          aria-hidden
                        />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
