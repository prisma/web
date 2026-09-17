import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <main className="z-1 mx-auto w-full max-w-[87.5rem] flex-1 px-4 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-2xl py-16 text-center sm:py-20">
        <h1 className="landing-h1">Blog</h1>
      </header>
      <div className="mx-auto flex flex-col items-center justify-center pb-20">
        {/* Chromatic-aberration glitch, retinted onto the prism triad: the
            offset copies are prism red and prism cyan instead of the CSS
            keyword colours they used to use. */}
        <h2
          style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
          className="
              relative
              mb-6
              pointer-events-none
              font-semibold
              text-foreground-neutral-strong

              before:content-[attr(data-text)]
              before:absolute
              before:top-0
              before:left-[2px]
              before:w-full
              before:overflow-hidden
              before:[text-shadow:-2px_0_var(--color-prism-red-500)]
              before:animate-[glitch-1_2s_infinite_linear_alternate-reverse]

              after:content-[attr(data-text)]
              after:absolute
              after:top-0
              after:-left-[2px]
              after:w-full
              after:overflow-hidden
              after:[text-shadow:-2px_0_var(--color-prism-cyan-400)]
              after:animate-[glitch-2_1.5s_infinite_linear_alternate-reverse]

              motion-reduce:before:animate-none
              motion-reduce:after:animate-none"
          data-text="404"
        >
          404
        </h2>
        <p className="mb-6 text-lg text-foreground-neutral-weak">
          We could not find the page you were looking for
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-circle bg-background-neutral-reverse-strong px-5 py-2.5 text-sm font-medium text-foreground-neutral-reverse shadow-box-low transition-transform duration-300 hover:scale-[1.04] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          Back to blog
        </Link>
      </div>
    </main>
  );
}
