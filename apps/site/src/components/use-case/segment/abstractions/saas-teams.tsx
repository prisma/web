import { ConsoleIllustration } from "@/components/sections/console-illustration";

// Intro — the actual Prisma Console: one project with an app and a database,
// ready to deploy. Reuses the landing-page illustration so the picture shows
// the real product, not a placeholder (teammate feedback, 2026-08-26).
//
// The hero visual that used to live here — a fabricated SaaS project console —
// is gone: the use-case heroes carry the agent character now (client feedback,
// 2026-09-04). See use-case-hero.tsx.
export function SaasIntroVisual() {
  return <ConsoleIllustration />;
}
