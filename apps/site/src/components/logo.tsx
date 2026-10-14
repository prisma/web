import { Blocks } from "lucide-react";
import Link from "next/link";
import { PrismaLogoMenu } from "@prisma-docs/ui/components/prisma-logo-menu";
import { siteConfig } from "@/lib/config";

// Right-clicking the logo opens the shared brand menu (the same one the docs
// and blog headers use). On the site its links stay relative.
export function Logo() {
  return (
    <PrismaLogoMenu section="website" siteUrl="">
      <Link href="/" className="playtime-logo" aria-label={`${siteConfig.name} home`}>
        <Blocks size={32} strokeWidth={2.5} aria-hidden="true" />
        <span>prisma</span>
        <span className="playtime-logo-tag">playtime!</span>
      </Link>
    </PrismaLogoMenu>
  );
}
