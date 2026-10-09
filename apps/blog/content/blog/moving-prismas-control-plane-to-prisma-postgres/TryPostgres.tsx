"use client";

import { Button } from "@prisma/eclipse";
import { trackCTA } from "@prisma-docs/ui/lib/analytics";

const HREF =
  "https://console.prisma.io/?utm_source=blog&utm_medium=blog&utm_campaign=control-plane-migration&utm_content=intro-cta";

/**
 * A quiet aside near the top of the post: the database this story ends up on
 * can be created in the Console while reading. Click tracking matches the
 * footer CTA so both show up as `cta_click` events in the same report.
 */
export function TryPostgres() {
  return (
    <aside className="cp-try not-prose" aria-label="Try Prisma Postgres">
      <p className="cp-try-text">
        Prisma Postgres is the database this post ends up on. If you want one open while you read,
        creating a database in the Console takes about a minute and is free to start.
      </p>
      <Button asChild variant="ink" size="lg">
        <a
          href={HREF}
          onClick={() =>
            trackCTA({
              cta_text: "Create a Prisma Postgres database",
              cta_location: "blog_post_intro",
              cta_destination: HREF,
              section: "blog",
            })
          }
        >
          <span>Create a Prisma Postgres database</span>
          <i className="fa-regular fa-arrow-right" aria-hidden />
        </a>
      </Button>
    </aside>
  );
}
