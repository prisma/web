import { Button } from "@prisma/eclipse";

const CTA_HREF = "https://pris.ly/pdp?utm_source=blog&utm_medium=blog_cta&utm_campaign=blog_post";

export const BlogCTA = () => {
  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl border border-background-neutral shadow-box-low">
      <div className="pointer-events-none absolute inset-0 bg-radial from-background-ppg-reverse/20 from-0% to-background-default to-70%" />
      <div className="relative z-1 flex flex-col items-center gap-6 px-6 py-14 text-center">
        <div className="flex flex-col items-center gap-2">
          <h3 className="font-family-display font-[650] text-2xl text-foreground-neutral m-0">
            Build your next app with Prisma
          </h3>
          <p className="text-foreground-neutral-weak m-0 max-w-md">
            Start free. Scale when you&rsquo;re ready.
          </p>
        </div>
        <Button asChild variant="ppg" size="2xl">
          <a href={CTA_HREF}>
            <span>Try Prisma</span>
            <i className="fa-regular fa-arrow-right" aria-hidden />
          </a>
        </Button>
      </div>
    </div>
  );
};
