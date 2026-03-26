"use client";
import { cn } from "../lib/cn";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export const YouTubePlayer = ({
  video,
  thumbnail,
  className,
  serverlessTalk = false,
  autoplay = false,
  overlay,
  playOnView = false,
}: {
  className?: string;
  serverlessTalk?: boolean;
  video: string;
  thumbnail?: string;
  playOnView?: boolean;
  autoplay?: boolean;
  overlay?: string;
}) => {
  const [playing, setPlaying] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(autoplay);
  const getAutoplayParams = () =>
    shouldAutoplay
      ? `${video.includes("?") ? "&" : "?"}autoplay=1&mute=1&rel=0`
      : "";

  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView && playOnView && !playing) {
      setPlaying(true);
      setShouldAutoplay(true);
    }
  }, [inView, playOnView, playing]);

  return (
    <div className={cn("w-full rounded-lg", className)} ref={ref}>
      {overlay && (
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-full z-[100] pointer-events-none rounded-lg",
            "bg-gradient-to-br from-[#8F55FF] via-[#642CEA] via-[#7048FF] to-[#8862FF]",
            "mix-blend-hard-light opacity-[0.28]",
            overlay,
          )}
        />
      )}
      {thumbnail && !playing && (
        <div
          role="button"
          tabIndex={0}
          onClick={() => {
            setPlaying(true);
            setShouldAutoplay(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setPlaying(true);
              setShouldAutoplay(true);
            }
          }}
          className={cn(
            "relative z-20 block w-full h-full object-cover",
            serverlessTalk && "absolute z-[21] bg-[#151630]",
          )}
        >
          <img
            alt="thumbnail"
            src={thumbnail}
            width={558}
            height={300}
            className={cn(
              "w-full h-full object-cover cursor-pointer",
              serverlessTalk && "object-contain",
            )}
          />
        </div>
      )}
      <div
        className={cn(
          "relative z-20 w-full",
          playing ? "block" : "hidden",
          serverlessTalk && "max-w-full pt-[56.25%] relative w-full h-min",
        )}
      >
        {video && (
          <iframe
            className={cn(
              "w-full border-0 rounded-[10px]",
              serverlessTalk && "absolute top-0 left-0 w-full h-full",
            )}
            height="287"
            src={`https://www.youtube.com/embed/${video}${getAutoplayParams()}`}
            title="YouTube Video"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};
