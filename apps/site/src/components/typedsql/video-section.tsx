"use client";

export const VideoSection = () => {
  return (
    <div className="max-w-[1232px] mx-auto px-4 py-16 md:py-24">
      <h2 className="text-foreground-neutral stretch-display text-4xl font-black! font-sans-display mt-0 mb-10 text-center">
        See TypedSQL in action
      </h2>
      <div className="max-w-[900px] mx-auto rounded-xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]">
        <iframe
          src="https://www.youtube.com/embed/ZwYcCti6CEs"
          width="100%"
          style={{ aspectRatio: "16/9" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="See TypedSQL in action"
          loading="lazy"
        />
      </div>
    </div>
  );
};
