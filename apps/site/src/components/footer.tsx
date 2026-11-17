import Link from "next/link";
import { Bluesky, Github, Linkedin, Mail, XSocial, Youtube } from "@/components/icons/forma";
import { AnimatedWordmark } from "@/components/brand/animated-wordmark";
import { SiteLink } from "@/components/site-link";
import { siteConfig } from "@/lib/config";
import { GooglePreferredSourceButton } from "@prisma-docs/ui/components/google-preferred-source";

// Light reference-style footer (Fincrest): brand block on the left (logo,
// email, Google link, copyright), link columns on the right, and the giant
// ghost wordmark rising out of the page's bottom edge.
// The brand stack uses the same 12px step between the logo, email, Google
// link, and copyright as the column links. Columns stay on 12px inside a
// group, 32px between groups, and 48px before the columns and the wordmark.
// TODO: hello@prisma.io is a placeholder contact — confirm with the client.

const COLUMNS = [
  { title: "Product", items: siteConfig.footer.product },
  { title: "Company", items: siteConfig.footer.company },
  { title: "Resources", items: siteConfig.footer.resources },
  { title: "Legal & Trust", items: siteConfig.footer.legalTrust },
] as const;

const contactLinkClass =
  "inline-flex items-center gap-2.5 text-sm leading-5 text-muted-foreground transition-colors hover:text-foreground";

const SOCIALS = [
  { label: "Twitter", href: siteConfig.social.twitter, Icon: XSocial },
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: Linkedin },
  { label: "GitHub", href: siteConfig.social.github, Icon: Github },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: Youtube },
  { label: "Bluesky", href: siteConfig.social.bluesky, Icon: Bluesky },
] as const;

export function Footer() {
  return (
    <footer className="overflow-hidden bg-white pt-16">
      <div className="mx-auto max-w-[96rem] px-6 sm:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_2.4fr] lg:gap-20">
          <div className="flex max-w-xs flex-col items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo/full-color.svg"
              alt={siteConfig.name}
              className="h-7 w-auto self-start"
            />
            <div className="mt-3 flex flex-col items-start gap-3">
              <a href="mailto:hello@prisma.io" className={contactLinkClass}>
                <Mail className="size-4 shrink-0" aria-hidden />
                hello@prisma.io
              </a>
              <GooglePreferredSourceButton
                monochrome
                className={`${contactLinkClass} rounded-none border-0 bg-transparent p-0 font-normal shadow-none hover:bg-transparent`}
                data-attr="footer-google-preferred-source"
              />
            </div>
            <p className="mt-3 text-sm leading-5 text-muted-foreground">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
          </div>

          <div className="grid grid-cols-2 items-start gap-x-8 gap-y-8 sm:grid-cols-4 xl:grid-cols-5">
            {COLUMNS.map(({ title, items }) => (
              <div key={title}>
                <h3 className="mb-3 text-sm font-semibold leading-5 text-foreground">{title}</h3>
                <ul className="space-y-3 text-sm leading-5">
                  {items.map((item) => (
                    <li key={item.href}>
                      <SiteLink
                        href={item.href}
                        className="block text-sm leading-5 text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="mb-3 text-sm font-semibold leading-5 text-foreground">Social Media</h3>
              <ul className="space-y-3 text-sm leading-5">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-sm leading-5 text-muted-foreground transition-colors hover:text-foreground"
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

        {/* the giant footer wordmark — kept inside the page's max-width so it
            never grows wider than the rest of the content; the letters span
            the content width and the rays bleed off past the right. */}
        <div className="pointer-events-none relative mt-12 pb-6">
          <div className="w-[116.1%]">
            <AnimatedWordmark />
          </div>
        </div>
      </div>
    </footer>
  );
}
