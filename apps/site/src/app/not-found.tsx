import GlitchParticles from "@/components/glitch-particles";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="flex-1 w-full max-w-249 mx-auto px-4 py-8 z-1">
      <h1 className="pointer-events-none absolute opacity-0 stretch-display text-4xl font-bold mb-2 landing-h1 text-center mt-9 font-sans-display">
        Prisma Website | 404
      </h1>
      <div className="relative mx-auto flex flex-col items-center justify-center -mt-10 md:-mt-30">
        <GlitchParticles />
        <p className="pointer-events-none absolute top-[65%] text-foreground-neutral-weak text-2xl md:text-[46px] font-semibold mb-4 font-mono">
          page not found
        </p>
      </div>
    </main>
  );
}
