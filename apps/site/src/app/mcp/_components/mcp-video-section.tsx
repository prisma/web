export function McpVideoSection() {
  return (
    <section className="bg-card px-4 pt-14 sm:px-8">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-foreground/[0.06] bg-card shadow-[0_1px_2px_rgba(21,21,21,0.04)]">
          <div className="relative aspect-video w-full">
            <iframe
              className="size-full"
              src="https://www.youtube.com/embed/jFm41OPnOUc"
              title="Prisma MCP video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              loading="lazy"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
