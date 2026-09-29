import Image from "next/image";
import Link from "next/link";
import { PrismaLogoMenu } from "@prisma-docs/ui/components/prisma-logo-menu";
import { siteConfig } from "@/lib/config";

// Right-clicking the logo opens the shared brand menu (the same one the docs
// and blog headers use). On the site its links stay relative.
export function Logo() {
  return (
    <PrismaLogoMenu siteUrl="">
      <Link href="/" className="flex items-center">
        <Image src="/logo/full-color.svg" alt={siteConfig.name} width={110} height={28} priority />
      </Link>
    </PrismaLogoMenu>
  );
}
