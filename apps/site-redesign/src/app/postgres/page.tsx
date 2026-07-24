import type { Metadata } from "next"
import { placeholderContent } from "@/components/product/placeholder-content"
import { ProductPage } from "@/components/product/product-page"

// First instance of the product page template (design-ref/sitemap.md,
// Platform group). Placeholder copy until the Postgres content lands.
export const metadata: Metadata = {
  title: "Postgres",
  description: "Managed Postgres, provisioned in seconds.",
}

export default function PostgresPage() {
  return <ProductPage content={placeholderContent} />
}
