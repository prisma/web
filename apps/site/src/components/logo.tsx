import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

export function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <Image src="/logo/full-color.svg" alt={siteConfig.name} width={110} height={28} priority />
    </Link>
  );
}
