import Image from "next/image";

export function AgentCard({
  logo,
  alt,
  icon,
  href,
}: {
  logo: string | null;
  alt: string;
  icon: string | null;
  href: string;
}) {
  return (
    <a
      href={href}
      title={alt}
      aria-label={alt}
      className="group relative flex h-30 w-full max-w-[165px] items-center justify-center rounded-[12px] border border-stroke-neutral bg-background-neutral-weaker shadow-box-low no-underline outline-offset-4 transition-[border-color,background-color,box-shadow] hover:border-stroke-ppg/60 hover:bg-background-default hover:shadow-box-high focus-visible:ring-2 focus-visible:ring-stroke-ppg dark:bg-background-neutral-weaker dark:hover:bg-background-neutral"
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={48}
          height={48}
          className="size-12 object-contain brightness-0 opacity-45 transition-opacity group-hover:opacity-65 dark:opacity-55 dark:invert"
          unoptimized
        />
      ) : (
        <span className="font-mono text-lg text-foreground-neutral-weak">
          Any AI agent
        </span>
      )}
      {icon ? (
        <span
          className="absolute right-1.75 top-1.75 text-foreground-neutral-weaker opacity-50 transition-opacity group-hover:opacity-100"
          aria-hidden
        >
          <i className={`${icon} text-[16px]`} />
        </span>
      ) : null}
    </a>
  );
}
