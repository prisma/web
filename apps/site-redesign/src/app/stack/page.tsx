import type { Metadata } from "next";
import { CtaBurst } from "@/components/sections/cta-burst";
import { StackBento } from "@/components/sections/stack-bento";
import { RoleKicker } from "@/components/brand/role-kicker";
import { Texture } from "@/components/brand/texture";

export const metadata: Metadata = {
  title: "The Prisma Stack",
  description:
    "ORM, Postgres, and Compute — one platform for your app and its database, with one shared context across your stack.",
};

// Interim /stack page: the header's "Explore the stack" link needs a real
// destination. Reuses the homepage's StackBento until CF designs the full
// stack page (the old site's /stack diagram stays on apps/site meanwhile).
export default function StackPage() {
  return (
    <>
      <section className="bg-white px-3 pt-3 sm:px-4 sm:pt-4">
        <div className="relative mx-auto max-w-[96rem] overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
          <Texture opacity={0.06} blend="multiply" />
          <div className="relative px-4 sm:px-8">
            <div className="mx-auto flex max-w-site flex-col items-center pb-10 pt-32 text-center md:pb-12 md:pt-44">
              <RoleKicker color="bg-prism-red-400" className="justify-center">
                The Prisma stack
              </RoleKicker>
              <h1 className="isolate mt-4 max-w-[22ch] text-balance text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.06]">
                One platform, from schema to production
              </h1>
              <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-muted-foreground">
                ORM, Postgres, and Compute work together natively — one shared context across your
                stack, one bill, and nothing to glue together.
              </p>
            </div>
          </div>
        </div>
      </section>
      <StackBento />
      <CtaBurst />
    </>
  );
}
