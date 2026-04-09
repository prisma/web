export function McpVideoSection() {
  return (
    <section className="px-4 py-12 md:px-0">
      <div className="mx-auto w-full max-w-[684px] overflow-hidden rounded-[8px]">
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
    </section>
  );
}
