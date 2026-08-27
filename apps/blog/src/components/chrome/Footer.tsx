// Blog chrome, modelled on apps/site-redesign/src/components/footer.tsx:
// brand block (logo, one-line description, social icons) on the left, link
// columns on the right, a quiet bottom bar, and the giant ghost wordmark rising
// out of the page's bottom edge.
//
// The link data is the blog's existing footer data (@prisma-docs/ui/data/footer)
// so no destination is invented or lost. Two shape differences from CF: the
// "Legal" entry is a dropdown in that data, and CF's footer has no dropdowns —
// so its children are flattened into the bottom bar next to the copyright,
// which is where CF keeps legal links anyway. The compliance badges, the
// platform-status readout, and the newsletter form are existing blog features
// and are carried over rather than dropped.
//
// CF's original is light-only (`bg-white`, `border-black/[0.06]`); here the
// surfaces are eclipse tokens so dark mode works.
import footerData from "@prisma-docs/ui/data/footer";
import { gdpr, hipaa, iso27, soc2 } from "@prisma-docs/ui/components/footer-badges";
import PDPStatus from "@prisma-docs/ui/components/pdp-status";
import {
  GooglePreferredSourceButton,
  eclipseButtonClass,
} from "@prisma-docs/ui/components/google-preferred-source";
import { cn } from "@prisma-docs/ui/lib/cn";
import type { ReactNode } from "react";
import { BLOG_HOME_DESCRIPTION } from "@/lib/blog-metadata";
import { BLOG_PREFIX } from "@/lib/url";
import { AnimatedWordmark } from "./AnimatedWordmark";
import { Logo } from "./logo";

interface FooterLink {
  title: string;
  url: string;
  external?: boolean;
}

interface FooterEntry extends Partial<FooterLink> {
  _type: string;
  title: string;
  links?: FooterLink[];
}

interface FooterColumn {
  title: string;
  links: FooterEntry[];
}

const COLUMNS = footerData.footerItems as unknown as FooterColumn[];

// Everything the source data files under a dropdown (today: Legal) moves to the
// bottom bar; everything else stays a column link.
const LEGAL: FooterLink[] = COLUMNS.flatMap((column) =>
  column.links
    .filter((link) => link._type !== "footerLinkType")
    .flatMap((link) => link.links ?? []),
);

const SOCIALS = footerData.socialIcons as Array<{ title: string; icon: string; url: string }>;

const linkClass =
  "text-foreground-neutral-weak hover:text-foreground-neutral text-sm no-underline transition-colors duration-300 motion-reduce:transition-none";

function FooterLinkAnchor({ link }: { link: FooterLink }) {
  return (
    <a
      href={link.url}
      className={linkClass}
      {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {link.title}
    </a>
  );
}

export function Footer({ newsletterComponent }: { newsletterComponent?: ReactNode }) {
  return (
    // The footer sits on the brand paper tone (#f9faf5 light / #1a1a1a dark)
    // behind a hairline — the same one-step-off-the-page surface the docs
    // sidebar rests on — so every page closes on the tone the hero wash opens
    // with instead of dissolving into flat white/ink.
    <footer className="bg-paper border-stroke-neutral relative z-1 mt-24 w-full overflow-hidden border-t pt-16">
      <div className="mx-auto max-w-[87.5rem] px-6 sm:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2.4fr] lg:gap-20">
          <div className="max-w-xs">
            <Logo />
            <p className="text-foreground-neutral-weak mt-5 text-sm leading-relaxed">
              {BLOG_HOME_DESCRIPTION}
            </p>
            <div className="mt-7 flex items-center gap-4">
              {SOCIALS.map((social) => (
                <a
                  key={social.title}
                  href={social.url}
                  aria-label={social.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground-neutral-weak hover:text-foreground-neutral text-lg transition-colors duration-300 motion-reduce:transition-none"
                >
                  <i aria-hidden className={`fa-brands fa-${social.icon}`} />
                </a>
              ))}
            </div>
            {newsletterComponent ? (
              <div className="mt-8 w-full max-w-[280px]">{newsletterComponent}</div>
            ) : null}
            <GooglePreferredSourceButton
              className={cn("mt-8", eclipseButtonClass)}
              data-attr="footer-google-preferred-source"
            />
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-foreground-neutral mb-4 text-sm font-semibold">
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links
                    .filter(
                      (link): link is FooterEntry & FooterLink => link._type === "footerLinkType",
                    )
                    .map((link) => (
                      <li key={link.url}>
                        <FooterLinkAnchor link={link} />
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-stroke-neutral mt-16 flex flex-col gap-6 border-t py-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <p className="text-foreground-neutral-weak text-sm">
              &copy; {new Date().getFullYear()} Prisma Data, Inc.
            </p>
            {LEGAL.map((link) => (
              <FooterLinkAnchor key={link.url} link={link} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <PDPStatus className="justify-start" />
            <div className="flex items-center gap-5">
              {[
                { label: "GDPR Compliance – Prisma Trust", badge: gdpr },
                { label: "HIPAA Compliance – Prisma Trust", badge: hipaa },
                { label: "ISO 27001 – Prisma Trust", badge: iso27 },
                { label: "SOC 2 – Prisma Trust", badge: soc2 },
              ].map(({ label, badge }) => (
                <a
                  key={label}
                  href="https://trust.prisma.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="opacity-80 transition-opacity duration-300 hover:opacity-100 motion-reduce:transition-none"
                >
                  {/* the badge helper builds `${basePath}/badges/*.svg`, so it
                      wants the prefix without a trailing slash */}
                  {badge(BLOG_PREFIX)}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* the giant footer wordmark — kept inside the page's max-width so it
            never grows wider than the rest of the content; the letters span the
            content width and the rays bleed off past the right. */}
        <div className="pointer-events-none relative mt-10 pb-6">
          <div className="w-[116.1%]">
            <AnimatedWordmark />
          </div>
        </div>
      </div>
    </footer>
  );
}
