import type { ReactNode } from "react";

// Prisma Postgres project only. React hoists this async script into the
// document <head> and the browser runs it on page load. analytics.js reads
// data-key from document.currentScript, so it has to be a native script tag.
// Cookieless, and not consent-gated: Ahrefs' install check does not click
// the cookie banner. Do not move this to the root layout; homepage, /orm,
// and /compute belong to a different Ahrefs project.
export default function PostgresLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="aF9oT6bnZ5BtW0m9HClnWQ"
        async
      />
      {children}
    </>
  );
}
