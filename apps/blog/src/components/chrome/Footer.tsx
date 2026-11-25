// The blog footer matches the homepage footer (apps/site/src/components/
// footer.tsx; client, 2026-11-25: "match the footer to the homepage"): the
// brand block on the left (logo, email, Google link, copyright), five link
// columns on the right, and the giant ghost wordmark rising out of the
// page's bottom edge. The links come from the same shared data the site
// uses (@prisma-docs/ui/data/site-footer), so the two can't drift apart.
//
// Differences from the site's, kept on purpose:
// - colours are eclipse tokens, so dark mode works (the site is light-only);
// - social icons are FontAwesome brands (the site's forma icons live in
//   apps/site), at the same 16px.
//
// The blog's earlier extras (description, newsletter form, compliance
// badges, platform status, legal bar) are dropped to match; the Legal &
// Trust column carries the legal links and the status page.
import { GooglePreferredSourceButton } from "@prisma-docs/ui/components/google-preferred-source";
import {
  SITE_CONTACT_EMAIL,
  SITE_FOOTER_COLUMNS,
  SITE_SOCIALS,
} from "@prisma-docs/ui/data/site-footer";
import { AnimatedWordmark } from "./AnimatedWordmark";
import { Logo } from "./logo";

const SOCIAL_ICON: Record<(typeof SITE_SOCIALS)[number]["key"], string> = {
  twitter: "fa-brands fa-x-twitter",
  linkedin: "fa-brands fa-square-linkedin",
  github: "fa-brands fa-github",
  youtube: "fa-brands fa-youtube",
  bluesky: "fa-brands fa-bluesky",
};

const linkClass =
  "text-foreground-neutral-weak hover:text-foreground-neutral block text-sm leading-5 no-underline transition-colors motion-reduce:transition-none";
const contactLinkClass =
  "text-foreground-neutral-weak hover:text-foreground-neutral inline-flex items-center gap-2.5 text-sm leading-5 no-underline transition-colors motion-reduce:transition-none";

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function Footer() {
  return (
    <footer className="bg-background-default relative z-1 mt-24 w-full overflow-hidden pt-16">
      <div className="mx-auto max-w-[96rem] px-6 sm:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_2.4fr] lg:gap-20">
          {/* Brand block: the same 12px step between the logo, email, Google
              link and copyright as the column links, as on the site. */}
          <div className="flex max-w-xs flex-col items-start">
            <Logo className="self-start [&_img]:h-7!" />
            <div className="mt-3 flex flex-col items-start gap-3">
              <a href={`mailto:${SITE_CONTACT_EMAIL}`} className={contactLinkClass}>
                <i aria-hidden className="fa-regular fa-envelope w-4 text-center" />
                {SITE_CONTACT_EMAIL}
              </a>
              <GooglePreferredSourceButton
                monochrome
                className={`${contactLinkClass} rounded-none border-0 bg-transparent p-0 font-normal shadow-none hover:bg-transparent`}
                data-attr="footer-google-preferred-source"
              />
            </div>
            <p className="text-foreground-neutral-weak mt-3 mb-0 text-sm leading-5">
              &copy; {new Date().getFullYear()} Prisma. All rights reserved.
            </p>
          </div>

          <div className="grid grid-cols-2 items-start gap-x-8 gap-y-8 sm:grid-cols-4 xl:grid-cols-5">
            {SITE_FOOTER_COLUMNS.map(({ title, items }) => (
              <div key={title}>
                <h3 className="text-foreground-neutral m-0 mb-3 text-sm leading-5 font-semibold">
                  {title}
                </h3>
                <ul className="m-0 list-none space-y-3 p-0">
                  {items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className={linkClass}
                        {...(isExternal(item.href)
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="text-foreground-neutral m-0 mb-3 text-sm leading-5 font-semibold">
                Social Media
              </h3>
              <ul className="m-0 list-none space-y-3 p-0">
                {SITE_SOCIALS.map(({ key, label, href }) => (
                  <li key={key}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={contactLinkClass}
                    >
                      <i aria-hidden className={`${SOCIAL_ICON[key]} w-4 text-center`} />
                      {label}
                    </a>
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
