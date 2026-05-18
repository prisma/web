"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  videoId: string;
  title: string;
};

export const AutoplayYoutubeEmbed = ({ videoId, title }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (data?.event === "onStateChange" && data?.info === 1) {
          setPlaying(true);
        }
      } catch {
        // Non-JSON messages from the iframe are ignored.
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const onLoad = () => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(JSON.stringify({ event: "listening", id: videoId }), "*");
    win.postMessage(
      JSON.stringify({
        event: "command",
        func: "addEventListener",
        args: ["onStateChange"],
      }),
      "*",
    );
  };

  const src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        onLoad={onLoad}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          border: 0,
          pointerEvents: "none",
        }}
      />
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          opacity: playing ? 0 : 1,
          transition: "opacity 0.3s ease-in",
        }}
      />
    </div>
  );
};
