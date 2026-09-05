import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex h-11 shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <BrandLogo className="h-7" priority />
    </Link>
  );
}
