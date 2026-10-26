import { siteConfig } from "@/lib/config";

// Minimal footer for the landing pages: the legal links a sign-up page needs
// and nothing that leads away from the CTA. prisma.io is listed once, as a
// plain link, for the visitor who wants the full site. The extra bottom
// padding on phones keeps the links clear of the sticky CTA bar.
const LINKS = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "prisma.io", href: "/" },
] as const;

export function LandingFooter() {
  return (
    <footer className="bg-white px-6 py-10 max-md:pb-28 sm:px-10">
      <div className="mx-auto flex max-w-site flex-col items-start gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <ul className="flex items-center gap-5">
          {LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href} className="transition-colors hover:text-foreground">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
