import Link from "next/link"
import { Github, Linkedin, Mail, XSocial } from "@/components/icons/forma"
import { AnimatedWordmark } from "@/components/brand/animated-wordmark"
import { siteConfig } from "@/lib/config"

// Light reference-style footer (Fincrest): brand block with contact + social
// icons on the left, link columns (including a Social Media column) on the
// right, quiet bottom bar with the legal links, and the giant ghost wordmark
// rising out of the page's bottom edge.
// TODO: hello@prisma.io is a placeholder contact — confirm with the client.

const COLUMNS = [
  { title: "Product", items: siteConfig.footer.product },
  { title: "Company", items: siteConfig.footer.company },
  { title: "Resources", items: siteConfig.footer.resources },
] as const

const SOCIALS = [
  { label: "Twitter", href: siteConfig.social.twitter, Icon: XSocial },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: Linkedin },
  { label: "GitHub", href: siteConfig.social.github, Icon: Github },
] as const

export function Footer() {
  return (
    <footer className="overflow-hidden bg-white pt-16">
      <div className="mx-auto max-w-[96rem] px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2.4fr] lg:gap-20">
          <div className="max-w-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/full-color.svg" alt={siteConfig.name} className="h-7 w-auto" />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <a
              href="mailto:hello@prisma.io"
              className="mt-5 inline-flex items-center gap-2 border-b border-foreground/25 pb-0.5 text-sm text-foreground transition-colors hover:border-foreground"
            >
              <Mail className="size-4" aria-hidden />
              hello@prisma.io
            </a>
            <div className="mt-8 flex items-center gap-4">
              {SOCIALS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 transition-colors hover:text-foreground"
                >
                  <Icon className="size-5" aria-hidden />
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map(({ title, items }) => (
              <div key={title}>
                <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Social Media</h3>
              <ul className="space-y-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="size-4" aria-hidden />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 grid items-center gap-4 border-t border-black/[0.06] py-6 md:grid-cols-3">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6 md:justify-center">
            {siteConfig.footer.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* the giant footer wordmark — kept inside the page's max-width so it
            never grows wider than the rest of the content; the letters span
            the content width and the rays bleed off past the right. */}
        <div className="pointer-events-none relative mt-10 pb-6">
          <div className="w-[116.1%]">
            <AnimatedWordmark />
          </div>
        </div>
      </div>
    </footer>
  )
}
